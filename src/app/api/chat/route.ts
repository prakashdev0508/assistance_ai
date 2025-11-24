import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { createCalendarTools } from "~/server/tools/calendarTools";
import { createGmailTools } from "~/server/tools/gmailTools";
import { createMeetTools } from "~/server/tools/meetTools";
import { createDateTools } from "~/server/tools/dateTools";
import { createTaskTools } from "~/server/tools/taskTools";
import { SYSTEM_PROMPT } from "~/server/prompts";
import { env } from "~/env";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = (await request.json()) as {
      message: string;
      sessionId?: number;
    };

    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Get or create chat session
    let chatSession;
    if (body.sessionId) {
      chatSession = await db.chatSession.findFirst({
        where: {
          id: body.sessionId,
          userId: user.id,
        },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!chatSession) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 },
        );
      }
    } else {
      // Create new session
      const threadId = randomUUID();
      chatSession = await db.chatSession.create({
        data: {
          userId: user.id,
          threadId,
          title: body.message.slice(0, 100) || "New Chat",
        },
        include: {
          messages: true,
        },
      });
    }

    // Load conversation history from database
    const historyMessages = chatSession.messages.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    }));

    // Initialize OpenAI model with system prompt
    const model = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0.7,
      apiKey: env.OPENAI_API_KEY,
    });

    // Create tools for Calendar, Gmail, Meet, Date, and Tasks
    const calendarTools = createCalendarTools(user.id);
    const gmailTools = createGmailTools(user.id);
    const meetTools = createMeetTools(user.id);
    const dateTools = createDateTools();
    const taskTools = createTaskTools(user.id);
    const allTools = [...calendarTools, ...gmailTools, ...meetTools, ...dateTools, ...taskTools];

    // Create agent with tools
    const agent = createAgent({
      model,
      tools: allTools,
    });

    // Build message history with system prompt
    // Include system message only if it's not already in history
    const hasSystemMessage = historyMessages.some(
      (msg) => msg.role === "system",
    );
    const langchainMessages = [
      ...(hasSystemMessage ? [] : [{ role: "system" as const, content: SYSTEM_PROMPT }]),
      ...historyMessages.filter((msg) => msg.role !== "system"),
      { role: "user" as const, content: body.message },
    ];

    // Invoke the agent
    const response = await agent.invoke({
      messages: langchainMessages,
    });

    // Extract the response content
    const lastMessage = response.messages[response.messages.length - 1];
    let responseContent = "";

    if (lastMessage) {
      if (typeof lastMessage.content === "string") {
        responseContent = lastMessage.content;
      } else if (Array.isArray(lastMessage.content)) {
        responseContent = lastMessage.content
          .map((block) => {
            if (typeof block === "string") return block;
            if (typeof block === "object" && "text" in block) {
              return block.text as string;
            }
            return JSON.stringify(block);
          })
          .join("\n");
      } else {
        responseContent = JSON.stringify(lastMessage.content);
      }
    } else {
      responseContent = "I apologize, but I couldn't generate a response.";
    }

    // Save messages to database
    await db.chatMessage.createMany({
      data: [
        {
          sessionId: chatSession.id,
          role: "user",
          content: body.message,
        },
        {
          sessionId: chatSession.id,
          role: "assistant",
          content: responseContent,
        },
      ],
    });

    // Update session title if it's still the default
    if (
      chatSession.title === body.message.slice(0, 100) ||
      chatSession.title === "New Chat"
    ) {
      const title = body.message.slice(0, 100) || "New Chat";
      await db.chatSession.update({
        where: { id: chatSession.id },
        data: { title, updatedAt: new Date() },
      });
    } else {
      await db.chatSession.update({
        where: { id: chatSession.id },
        data: { updatedAt: new Date() },
      });
    }

    return NextResponse.json({
      message: responseContent,
      sessionId: chatSession.id,
    });
  } catch (error) {
    console.error("[chat] Failed to process chat request", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process chat request",
      },
      { status: 500 },
    );
  }
}
