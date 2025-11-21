import { type Integration } from "@prisma/client";
import { env } from "~/env";
import { db } from "~/server/db";

export const GOOGLE_CALENDAR_PROVIDER = "google-calendar";
export const GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar",
].join(" ");

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const REVOKE_ENDPOINT = "https://oauth2.googleapis.com/revoke";
const REFRESH_LEEWAY_MS = 60 * 1000;

export async function getGoogleCalendarIntegration(userId: number) {
  return db.integration.findUnique({
    where: {
      userId_provider: {
        userId,
        provider: GOOGLE_CALENDAR_PROVIDER,
      },
    },
  });
}

export async function getValidGoogleCalendarAccessToken(userId: number) {
  const integration = await getGoogleCalendarIntegration(userId);

  if (!integration) {
    throw new Error("Google Calendar integration not found");
  }

  if (
    integration.expiresAt.getTime() >
    Date.now() + REFRESH_LEEWAY_MS
  ) {
    return integration.accessToken;
  }

  const refreshed = await refreshGoogleCalendarAccessToken(integration);
  return refreshed.accessToken;
}

export async function refreshGoogleCalendarAccessToken(
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
      `Failed to refresh Google Calendar token: ${response.status} ${response.statusText} ${JSON.stringify(error)}`,
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

export async function revokeGoogleCalendarIntegration(
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
    console.error("[calendar] Failed to revoke Google tokens", error);
  }
}

export async function fetchGoogleCalendarEvents(
  userId: number,
  options: {
    timeMin?: string;
    timeMax?: string;
    maxResults?: number;
    singleEvents?: boolean;
    orderBy?: "startTime" | "updated";
  } = {},
) {
  const accessToken = await getValidGoogleCalendarAccessToken(userId);
  const params = new URLSearchParams({
    maxResults: String(options.maxResults ?? 20),
    singleEvents: String(options.singleEvents ?? true),
    orderBy: options.orderBy ?? "startTime",
  });

  if (options.timeMin) params.set("timeMin", options.timeMin);
  if (options.timeMax) params.set("timeMax", options.timeMax);

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
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
      `Failed to fetch Google Calendar events: ${response.status} ${response.statusText} ${JSON.stringify(error)}`,
    );
  }

  return response.json() as Promise<{ items?: unknown[] }>;
}

export async function createGoogleCalendarEvent(
  userId: number,
  event: {
    summary: string;
    description?: string;
    start: {
      dateTime?: string;
      date?: string;
      timeZone?: string;
    };
    end: {
      dateTime?: string;
      date?: string;
      timeZone?: string;
    };
    location?: string;
    attendees?: Array<{
      email: string;
    }>;
  },
) {
  const accessToken = await getValidGoogleCalendarAccessToken(userId);

  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
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
      `Failed to create Google Calendar event: ${errorMessage}${errorDetails ? ` - ${errorDetails}` : ""}`,
    );
  }

  return response.json() as Promise<unknown>;
}

export async function updateGoogleCalendarEvent(
  userId: number,
  eventId: string,
  event: {
    summary?: string;
    description?: string;
    start?: {
      dateTime?: string;
      date?: string;
      timeZone?: string;
    };
    end?: {
      dateTime?: string;
      date?: string;
      timeZone?: string;
    };
    location?: string;
    attendees?: Array<{
      email: string;
    }>;
  },
) {
  const accessToken = await getValidGoogleCalendarAccessToken(userId);

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const error = await safeJson(response);
    throw new Error(
      `Failed to update Google Calendar event: ${response.status} ${response.statusText} ${JSON.stringify(error)}`,
    );
  }

  return response.json() as Promise<unknown>;
}

export async function deleteGoogleCalendarEvent(
  userId: number,
  eventId: string,
) {
  const accessToken = await getValidGoogleCalendarAccessToken(userId);

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const error = await safeJson(response);
    throw new Error(
      `Failed to delete Google Calendar event: ${response.status} ${response.statusText} ${JSON.stringify(error)}`,
    );
  }

  return true;
}

async function safeJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

