import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";
import {
  fetchGoogleGmailMessages,
  fetchGoogleGmailMessage,
  fetchGoogleGmailThreads,
} from "~/server/integrations/googleGmail";

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") ?? "messages"; // messages, message, threads
    const messageId = searchParams.get("messageId");
    const maxResults = parseInt(searchParams.get("maxResults") ?? "20", 10);
    const q = searchParams.get("q") ?? undefined;
    const pageToken = searchParams.get("pageToken") ?? undefined;

    if (type === "message" && messageId) {
      const message = await fetchGoogleGmailMessage(user.id, messageId);
      return NextResponse.json(message);
    }

    if (type === "threads") {
      const threads = await fetchGoogleGmailThreads(user.id, {
        maxResults,
        q,
        pageToken,
      });
      return NextResponse.json(threads);
    }

    // Default: fetch messages list
    const messages = await fetchGoogleGmailMessages(user.id, {
      maxResults,
      q,
      pageToken,
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("[gmail] Failed to fetch messages", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch Gmail messages",
      },
      { status: 500 },
    );
  }
}

