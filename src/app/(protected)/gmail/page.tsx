import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";
import {
  GOOGLE_GMAIL_PROVIDER,
  fetchGoogleGmailMessages,
  fetchGoogleGmailMessage,
} from "~/server/integrations/googleGmail";

type GmailMessage = {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  payload?: {
    headers?: Array<{ name: string; value: string }>;
    parts?: Array<{
      mimeType?: string;
      body?: { data?: string };
      parts?: Array<{
        mimeType?: string;
        body?: { data?: string };
      }>;
    }>;
    body?: { data?: string };
  };
  internalDate?: string;
};

function getHeaderValue(headers: Array<{ name: string; value: string }> | undefined, name: string): string {
  if (!headers) return "";
  const header = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return header?.value ?? "";
}

function parseEmailAddress(emailString: string): { name: string; email: string } {
  // Parse "Name <email@example.com>" or just "email@example.com"
  const regex = /^(.+?)\s*<(.+?)>$|^(.+)$/;
  const match = regex.exec(emailString);
  if (match) {
    if (match[3]) {
      return { name: match[3]?.split("@")[0] ?? "", email: match[3] ?? "" };
    }
    return { name: match[1]?.trim() ?? "", email: match[2] ?? "" };
  }
  return { name: "", email: emailString };
}

function getInitials(name: string, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0]?.[0] ?? "").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase();
    }
    return (name[0] ?? "").toUpperCase();
  }
  return (email[0] ?? "").toUpperCase();
}

function getAvatarColor(email: string): string {
  // Generate a consistent color based on email
  const colors = [
    "bg-[#ea4335]", "bg-[#4285f4]", "bg-[#34a853]", "bg-[#fbbc05]",
    "bg-[#ff6d00]", "bg-[#9c27b0]", "bg-[#00acc1]", "bg-[#e91e63]",
    "bg-[#795548]", "bg-[#607d8b]",
  ];
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length] ?? "bg-gray-500";
}

function formatEmailDate(internalDate?: string): string {
  if (!internalDate) return "";
  
  try {
    const date = new Date(parseInt(internalDate));
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  } catch {
    return "";
  }
}

function isUnread(message: GmailMessage): boolean {
  // In Gmail API, unread messages have "UNREAD" in labelIds
  // If labelIds is not available, default to read (false)
  return message.labelIds?.includes("UNREAD") ?? false;
}

function isStarred(message: GmailMessage): boolean {
  return message.labelIds?.includes("STARRED") ?? false;
}

export default async function GmailPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
  }

  const gmailIntegration = await db.integration.findUnique({
    where: {
      userId_provider: {
        userId: user.id,
        provider: GOOGLE_GMAIL_PROVIDER,
      },
    },
  });

  if (!gmailIntegration) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-black">Gmail</h1>
          <p className="text-sm text-black/60">
            View and manage your Gmail messages
          </p>
        </div>
        <div className="rounded-[28px] border border-white/60 bg-white/80 p-8 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] backdrop-blur text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#ea4335] via-[#fbbc05] to-[#34a853] text-white">
              <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                <path
                  d="M3 7l9 6 9-6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
                  fill="white"
                />
                <path d="M3 7l9 6 9-6-9-5-9 5Z" fill="white" opacity="0.6" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-black">
                Gmail not connected
              </h2>
              <p className="mt-2 text-sm text-black/60">
                Connect your Gmail to view and manage your emails
              </p>
            </div>
            <Link
              href="/integrations"
              className="mt-4 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/90"
            >
              Connect Gmail
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let messages: GmailMessage[] = [];
  let error: string | null = null;

  try {
    const response = await fetchGoogleGmailMessages(user.id, {
      maxResults: 50,
    });

    if (response.messages && Array.isArray(response.messages)) {
      // Fetch full message details for each message
      const messagePromises = response.messages.slice(0, 50).map((msg) =>
        fetchGoogleGmailMessage(user.id, msg.id).catch((err) => {
          console.error(`[gmail] Failed to fetch message ${msg.id}`, err);
          return null;
        })
      );

      const fetchedMessages = await Promise.all(messagePromises);
      messages = fetchedMessages.filter((msg): msg is GmailMessage => msg !== null);
    } else {
      messages = [];
    }
  } catch (err) {
    console.error("[gmail] Failed to fetch messages", err);
    error =
      err instanceof Error
        ? err.message
        : "Failed to fetch Gmail messages";
  }

  // Sort messages by date (newest first)
  messages.sort((a, b) => {
    const dateA = a.internalDate ? parseInt(a.internalDate) : 0;
    const dateB = b.internalDate ? parseInt(b.internalDate) : 0;
    return dateB - dateA;
  });

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col bg-white">
      {/* Gmail-like Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-4 flex-1">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search mail"
                className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-[#4285f4] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4285f4]"
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="https://mail.google.com/mail/u/0/#compose"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#1a73e8] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1557b0] transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Compose</span>
          </Link>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="border-b border-gray-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-semibold">Error loading emails</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {!error && messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="mt-4 text-gray-500">No emails found</p>
            </div>
          </div>
        )}

        {!error && messages.length > 0 && (
          <div className="divide-y divide-gray-100">
            {messages.map((message) => {
              const fromHeader = getHeaderValue(message.payload?.headers, "From");
              const subject = getHeaderValue(message.payload?.headers, "Subject");
              const date = formatEmailDate(message.internalDate);
              const snippet = message.snippet ?? "";
              const { name: senderName, email: senderEmail } = parseEmailAddress(fromHeader);
              const initials = getInitials(senderName, senderEmail);
              const avatarColor = getAvatarColor(senderEmail || senderName || "unknown");
              const unread = isUnread(message);
              const starred = isStarred(message);

              return (
                <a
                  key={message.id}
                  href={`https://mail.google.com/mail/u/0/#inbox/${message.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50 ${
                    unread ? "bg-blue-50/30" : "bg-white"
                  }`}
                >
                  {/* Checkbox */}
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                    <div className="h-4 w-4 rounded border border-gray-300"></div>
                  </div>

                  {/* Star */}
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                    <svg
                      className={`h-5 w-5 ${starred ? "fill-[#fbbc05] text-[#fbbc05]" : "text-gray-400 hover:text-yellow-500"}`}
                      fill={starred ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>

                  {/* Avatar */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${avatarColor} text-sm font-medium text-white`}>
                    {initials}
                  </div>

                  {/* Email Content */}
                  <div className="flex flex-1 items-center gap-4 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`truncate text-sm ${unread ? "font-semibold text-gray-900" : "font-normal text-gray-700"}`}>
                          {senderName || senderEmail || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`truncate text-sm ${unread ? "font-semibold text-gray-900" : "font-normal text-gray-600"}`}>
                          {subject || "(No subject)"}
                        </span>
                        {snippet && (
                          <span className="hidden md:inline text-sm text-gray-500 truncate">
                            - {snippet}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="shrink-0 text-xs text-gray-500 whitespace-nowrap">
                      {date}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
