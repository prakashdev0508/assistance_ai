import * as z from "zod";
import { tool } from "langchain";
import {
  fetchGoogleGmailMessages,
  fetchGoogleGmailMessage,
  fetchGoogleGmailThreads,
  sendGoogleGmailMessage,
} from "~/server/integrations/googleGmail";
import { db } from "~/server/db";

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

  const sendGmailReply = tool(
    async ({ messageId, body, cc, bcc, includeOriginalMessage }) => {
      try {
        const message = await fetchGoogleGmailMessage(userId, messageId as string);
        const headers = message.payload?.headers ?? [];
        const getHeader = (name: string) =>
          headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";

        const replyTo = getHeader("reply-to") || getHeader("from");
        if (!replyTo) {
          return "Unable to determine reply recipient for the original message.";
        }

        const originalSubject = getHeader("subject") || "(no subject)";
        const replySubject = originalSubject.toLowerCase().startsWith("re:")
          ? originalSubject
          : `Re: ${originalSubject}`;

        const messageIdHeader = getHeader("message-id");
        const sentMessage = await sendGoogleGmailMessage(userId, {
          to: replyTo,
          subject: replySubject,
          body: [
            body as string,
            includeOriginalMessage === false
              ? ""
              : [
                  "<br><br>--- Original Message ---<br>",
                  `On ${getHeader("date") || "an earlier date"}, ${replyTo} wrote:<br>`,
                  `<blockquote>${message.snippet ?? ""}</blockquote>`,
                ].join(""),
          ]
            .filter(Boolean)
            .join(""),
          cc: cc as string | undefined,
          bcc: bcc as string | undefined,
          threadId: message.threadId,
          inReplyTo: messageIdHeader,
          references: messageIdHeader,
        });

        return JSON.stringify(
          {
            status: "sent",
            message: "Reply dispatched. Confirm with the user that they approve the sent email.",
            threadId: sentMessage.threadId,
            id: sentMessage.id,
            reminder: "You must ask the user to approve or revise the email that was just sent.",
          },
          null,
          2,
        );
      } catch (error) {
        return `Error sending Gmail reply: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      }
    },
    {
      name: "send_gmail_reply",
      description:
        "Sends an email reply to an existing Gmail message using the authenticated account. This action IMMEDIATELY sends the reply. Before calling this tool, you MUST confirm with the user that they approve the sent message and be ready to send a follow-up if they request changes.",
      schema: z.object({
        messageId: z.string().describe("The Gmail message ID to reply to"),
        body: z.string().describe("HTML body for the reply. Include the full response text."),
        cc: z.string().optional().describe("Comma-separated CC recipients"),
        bcc: z.string().optional().describe("Comma-separated BCC recipients"),
        includeOriginalMessage: z
          .boolean()
          .optional()
          .describe(
            "Whether to append the original message snippet below the reply (default: true)",
          ),
      }),
    },
  );

  const sendGmailEmail = tool(
    async ({ to, subject, body, cc, bcc }) => {
      try {
        const sentMessage = await sendGoogleGmailMessage(userId, {
          to: to as string,
          subject: subject as string,
          body: body as string,
          cc: cc as string | undefined,
          bcc: bcc as string | undefined,
        });

        return JSON.stringify(
          {
            status: "sent",
            message: "New email sent. Confirm with the user that they approve the dispatched email.",
            id: sentMessage.id,
            threadId: sentMessage.threadId,
            reminder: "Before using this tool, the user must explicitly approve the email content.",
          },
          null,
          2,
        );
      } catch (error) {
        return `Error sending Gmail email: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "send_gmail_email",
      description:
        "Sends a brand-new email from the authenticated Gmail account. This action IMMEDIATELY sends the email, so only call it after the user explicitly approves the final content.",
      schema: z.object({
        to: z.string().describe("Primary recipient email address(es), comma-separated if multiple"),
        subject: z.string().describe("Subject line of the email"),
        body: z.string().describe("HTML body of the message"),
        cc: z.string().optional().describe("Optional CC recipients, comma-separated"),
        bcc: z.string().optional().describe("Optional BCC recipients, comma-separated"),
      }),
    },
  );

  const getUserEmailSignature = tool(
    async () => {
      try {
        const user = await db.user.findUnique({
          where: { id: userId },
          select: {
            name: true,
            emailSignature: true,
          },
        });

        if (!user) {
          return JSON.stringify({
            error: "User not found",
            signature: null,
            name: null,
          });
        }

        return JSON.stringify(
          {
            signature: user.emailSignature ?? null,
            name: user.name,
            hasSignature: !!user.emailSignature,
            message: user.emailSignature
              ? "User has a custom email signature saved."
              : "No custom email signature found. Will use user's name as signature.",
          },
          null,
          2,
        );
      } catch (error) {
        return `Error fetching user email signature: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "get_user_email_signature",
      description:
        "Retrieves the user's email signature and name from their account settings. This is CRITICAL to call before sending any email to ensure the email includes the proper signature. Returns the saved email signature if available, or the user's name as a fallback. Always call this tool before composing or sending emails to get the correct signature to include.",
      schema: z.object({}),
    },
  );

  return [
    listGmailMessages,
    getGmailMessage,
    listGmailThreads,
    getUserEmailSignature,
    sendGmailReply,
    sendGmailEmail,
  ];
}

