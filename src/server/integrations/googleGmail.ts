import { type Integration } from "@prisma/client";
import { env } from "~/env";
import { db } from "~/server/db";

export const GOOGLE_GMAIL_PROVIDER = "google-gmail";
export const GOOGLE_GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.modify",
].join(" ");

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const REVOKE_ENDPOINT = "https://oauth2.googleapis.com/revoke";
const REFRESH_LEEWAY_MS = 60 * 1000;

export async function getGoogleGmailIntegration(userId: number) {
  return db.integration.findUnique({
    where: {
      userId_provider: {
        userId,
        provider: GOOGLE_GMAIL_PROVIDER,
      },
    },
  });
}

export async function getValidGoogleGmailAccessToken(userId: number) {
  const integration = await getGoogleGmailIntegration(userId);

  if (!integration) {
    throw new Error("Google Gmail integration not found");
  }

  if (
    integration.expiresAt.getTime() >
    Date.now() + REFRESH_LEEWAY_MS
  ) {
    return integration.accessToken;
  }

  const refreshed = await refreshGoogleGmailAccessToken(integration);
  return refreshed.accessToken;
}

export async function refreshGoogleGmailAccessToken(
  integration: Integration,
) {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    refresh_token: integration.refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await safeJson(response);
    throw new Error(
      `Failed to refresh Google Gmail token: ${response.status} ${response.statusText} ${JSON.stringify(error)}`,
    );
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
    scope?: string;
  };

  const expiresAt = new Date(Date.now() + (data.expires_in ?? 3600) * 1000);

  return db.integration.update({
    where: { id: integration.id },
    data: {
      accessToken: data.access_token,
      expiresAt,
      scope: data.scope ?? integration.scope,
    },
  });
}

export async function revokeGoogleGmailIntegration(
  integration: Integration,
) {
  try {
    const params = new URLSearchParams({
      token: integration.refreshToken ?? integration.accessToken,
    });
    await fetch(`${REVOKE_ENDPOINT}?${params.toString()}`, {
      method: "POST",
    });
  } catch (error) {
    console.error("[gmail] Failed to revoke Google tokens", error);
  }
}

export async function fetchGoogleGmailMessages(
  userId: number,
  options: {
    maxResults?: number;
    q?: string;
    pageToken?: string;
  } = {},
) {
  const accessToken = await getValidGoogleGmailAccessToken(userId);
  const params = new URLSearchParams({
    maxResults: String(options.maxResults ?? 20),
  });

  if (options.q) params.set("q", options.q);
  if (options.pageToken) params.set("pageToken", options.pageToken);

  const response = await fetch(
    `https://www.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const error = await safeJson(response);
    throw new Error(
      `Failed to fetch Gmail messages: ${response.status} ${response.statusText} ${JSON.stringify(error)}`,
    );
  }

  return response.json() as Promise<{
    messages?: Array<{ id: string; threadId: string }>;
    nextPageToken?: string;
    resultSizeEstimate?: number;
  }>;
}

export async function fetchGoogleGmailMessage(
  userId: number,
  messageId: string,
) {
  const accessToken = await getValidGoogleGmailAccessToken(userId);

  const response = await fetch(
    `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const error = await safeJson(response);
    throw new Error(
      `Failed to fetch Gmail message: ${response.status} ${response.statusText} ${JSON.stringify(error)}`,
    );
  }

  return response.json() as Promise<{
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
  }>;
}

export async function fetchGoogleGmailThreads(
  userId: number,
  options: {
    maxResults?: number;
    q?: string;
    pageToken?: string;
  } = {},
) {
  const accessToken = await getValidGoogleGmailAccessToken(userId);
  const params = new URLSearchParams({
    maxResults: String(options.maxResults ?? 20),
  });

  if (options.q) params.set("q", options.q);
  if (options.pageToken) params.set("pageToken", options.pageToken);

  const response = await fetch(
    `https://www.googleapis.com/gmail/v1/users/me/threads?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const error = await safeJson(response);
    throw new Error(
      `Failed to fetch Gmail threads: ${response.status} ${response.statusText} ${JSON.stringify(error)}`,
    );
  }

  return response.json() as Promise<{
    threads?: Array<{ id: string; snippet?: string; historyId?: string }>;
    nextPageToken?: string;
    resultSizeEstimate?: number;
  }>;
}

export async function sendGoogleGmailMessage(
  userId: number,
  message: {
    to: string;
    subject: string;
    body: string;
    cc?: string;
    bcc?: string;
    threadId?: string;
    inReplyTo?: string;
    references?: string;
  },
) {
  const accessToken = await getValidGoogleGmailAccessToken(userId);

  // Build email message in RFC 2822 format
  const emailLines: string[] = [];
  emailLines.push(`To: ${message.to}`);
  if (message.cc) emailLines.push(`Cc: ${message.cc}`);
  if (message.bcc) emailLines.push(`Bcc: ${message.bcc}`);
  emailLines.push(`Subject: ${message.subject}`);
  if (message.inReplyTo) {
    emailLines.push(`In-Reply-To: ${message.inReplyTo}`);
  }
  if (message.references) {
    emailLines.push(`References: ${message.references}`);
  }
  emailLines.push("Content-Type: text/html; charset=utf-8");
  emailLines.push("");
  emailLines.push(message.body);

  const rawMessage = emailLines.join("\r\n");

  // Base64 encode the message
  const encodedMessage = Buffer.from(rawMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const bodyPayload: Record<string, unknown> = {
    raw: encodedMessage,
  };
  if (message.threadId) {
    bodyPayload.threadId = message.threadId;
  }

  const response = await fetch(
    "https://www.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPayload),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const error = (await safeJson(response)) as {
      error?: { message?: string; errors?: Array<{ message?: string }> };
      message?: string;
    } | null;
    const errorMessage = error?.error?.message ?? error?.message ?? "Unknown error";
    const errorDetails = error?.error?.errors?.[0]?.message ?? "";
    throw new Error(
      `Failed to send Gmail message: ${errorMessage}${errorDetails ? ` - ${errorDetails}` : ""}`,
    );
  }

  return response.json() as Promise<{
    id: string;
    threadId: string;
    labelIds?: string[];
  }>;
}

async function safeJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

