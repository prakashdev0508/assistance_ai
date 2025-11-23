import * as z from "zod";
import { tool } from "langchain";
import {
  fetchGoogleGmailMessages,
  fetchGoogleGmailMessage,
  fetchGoogleGmailThreads,
} from "~/server/integrations/googleGmail";

export function createGmailTools(userId: number) {
  const listGmailMessages = tool(
    async ({ maxResults, query, pageToken }) => {
      try {
        const result = await fetchGoogleGmailMessages(userId, {
          maxResults: maxResults as number | undefined,
          q: query as string | undefined,
          pageToken: pageToken as string | undefined,
        });

        const messages = result.messages ?? [];

        if (messages.length === 0) {
          return "No Gmail messages found.";
        }

        // Fetch full details for each message
        const messageDetails = await Promise.all(
          messages.slice(0, 10).map(async (msg) => {
            try {
              const fullMessage = await fetchGoogleGmailMessage(
                userId,
                msg.id,
              );
              return {
                id: fullMessage.id,
                threadId: fullMessage.threadId,
                snippet: fullMessage.snippet,
                subject:
                  fullMessage.payload?.headers?.find(
                    (h) => h.name.toLowerCase() === "subject",
                  )?.value ?? "",
                from:
                  fullMessage.payload?.headers?.find(
                    (h) => h.name.toLowerCase() === "from",
                  )?.value ?? "",
                date:
                  fullMessage.payload?.headers?.find(
                    (h) => h.name.toLowerCase() === "date",
                  )?.value ?? "",
              };
            } catch {
              return {
                id: msg.id,
                threadId: msg.threadId,
                snippet: "",
              };
            }
          }),
        );

        return JSON.stringify(messageDetails, null, 2);
      } catch (error) {
        return `Error fetching Gmail messages: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "list_gmail_messages",
      description:
        "Lists Gmail messages from the authenticated user's inbox with optional search filtering. Supports Gmail search syntax (e.g., 'from:example@gmail.com', 'subject:meeting', 'is:unread'). Returns message metadata including subject, sender, date, and snippet. Supports pagination via pageToken. Only returns messages from the authenticated user's account. Use this when the user asks about their emails, wants to see recent messages, or search for specific emails. Respect privacy when displaying content.",
      schema: z.object({
        maxResults: z
          .number()
          .optional()
          .describe("Maximum number of messages to return (default: 20)"),
        query: z
          .string()
          .optional()
          .describe(
            "Gmail search query (e.g., 'from:example@gmail.com', 'subject:meeting', 'is:unread')",
          ),
        pageToken: z
          .string()
          .optional()
          .describe("Page token for pagination"),
      }),
    },
  );

  const getGmailMessage = tool(
    async ({ messageId }) => {
      try {
        const message = await fetchGoogleGmailMessage(
          userId,
          messageId as string,
        );

        // Extract headers
        const headers = message.payload?.headers ?? [];
        const getHeader = (name: string) =>
          headers.find((h) => h.name.toLowerCase() === name.toLowerCase())
            ?.value ?? "";

        // Extract body text
        let bodyText = "";
        const extractBody = (payload: {
          body?: { data?: string };
          parts?: Array<{
            mimeType?: string;
            body?: { data?: string };
            parts?: Array<{ mimeType?: string; body?: { data?: string } }>;
          }>;
        }): void => {
          if (payload.body?.data) {
            try {
              bodyText += Buffer.from(payload.body.data, "base64").toString(
                "utf-8",
              );
            } catch {
              // Ignore decode errors
            }
          }
          if (payload.parts) {
            for (const part of payload.parts) {
              if (part.mimeType === "text/plain" && part.body?.data) {
                try {
                  bodyText += Buffer.from(part.body.data, "base64").toString(
                    "utf-8",
                  );
                } catch {
                  // Ignore decode errors
                }
              }
              if (part.parts) {
                extractBody(part);
              }
            }
          }
        };

        if (message.payload) {
          extractBody(message.payload);
        }

        return JSON.stringify(
          {
            id: message.id,
            threadId: message.threadId,
            subject: getHeader("subject"),
            from: getHeader("from"),
            to: getHeader("to"),
            cc: getHeader("cc"),
            date: getHeader("date"),
            snippet: message.snippet,
            body: bodyText || message.snippet,
            labels: message.labelIds,
          },
          null,
          2,
        );
      } catch (error) {
        return `Error fetching Gmail message: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "get_gmail_message",
      description:
        "Retrieves the full content of a specific Gmail message by its message ID. Returns complete message including headers (from, to, cc, subject, date), body text, snippet, and label metadata. Only accesses messages from the authenticated user's account. Be mindful of sensitive content when displaying results. Use this when the user wants to read a specific email in detail.",
      schema: z.object({
        messageId: z.string().describe("The ID of the Gmail message to retrieve"),
      }),
    },
  );

  const listGmailThreads = tool(
    async ({ maxResults, query, pageToken }) => {
      try {
        const result = await fetchGoogleGmailThreads(userId, {
          maxResults: maxResults as number | undefined,
          q: query as string | undefined,
          pageToken: pageToken as string | undefined,
        });

        const threads = result.threads ?? [];

        if (threads.length === 0) {
          return "No Gmail threads found.";
        }

        return JSON.stringify(
          threads.map((thread) => ({
            id: thread.id,
            snippet: thread.snippet,
            historyId: thread.historyId,
          })),
          null,
          2,
        );
      } catch (error) {
        return `Error fetching Gmail threads: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "list_gmail_threads",
      description:
        "Lists Gmail conversation threads (email chains) from the authenticated user's account. Supports Gmail search syntax for filtering and pagination via pageToken. Returns thread metadata including thread ID, snippet, and history ID. Only returns threads from the authenticated user's account. Use this when the user asks about email conversations or wants to see threaded discussions.",
      schema: z.object({
        maxResults: z
          .number()
          .optional()
          .describe("Maximum number of threads to return (default: 20)"),
        query: z
          .string()
          .optional()
          .describe(
            "Gmail search query (e.g., 'from:example@gmail.com', 'subject:meeting')",
          ),
        pageToken: z
          .string()
          .optional()
          .describe("Page token for pagination"),
      }),
    },
  );

  return [listGmailMessages, getGmailMessage, listGmailThreads];
}

