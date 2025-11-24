import { type Integration } from "@prisma/client";
import { env } from "~/env";
import { db } from "~/server/db";

export const GOOGLE_MEET_PROVIDER = "google-meet";
export const GOOGLE_MEET_SCOPES = [
  "https://www.googleapis.com/auth/meetings.space.created",
  "https://www.googleapis.com/auth/meetings.space.readonly",
].join(" ");

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const REVOKE_ENDPOINT = "https://oauth2.googleapis.com/revoke";
const REFRESH_LEEWAY_MS = 60 * 1000;

export async function getGoogleMeetIntegration(userId: number) {
  return db.integration.findUnique({
    where: {
      userId_provider: {
        userId,
        provider: GOOGLE_MEET_PROVIDER,
      },
    },
  });
}

export async function getValidGoogleMeetAccessToken(userId: number) {
  const integration = await getGoogleMeetIntegration(userId);

  if (!integration) {
    throw new Error("Google Meet integration not found");
  }

  if (integration.expiresAt.getTime() > Date.now() + REFRESH_LEEWAY_MS) {
    return integration.accessToken;
  }

  const refreshed = await refreshGoogleMeetAccessToken(integration);
  return refreshed.accessToken;
}

export async function refreshGoogleMeetAccessToken(integration: Integration) {
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
      `Failed to refresh Google Meet token: ${response.status} ${response.statusText} ${JSON.stringify(error)}`,
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

export async function revokeGoogleMeetIntegration(integration: Integration) {
  try {
    const params = new URLSearchParams({
      token: integration.refreshToken ?? integration.accessToken,
    });
    await fetch(`${REVOKE_ENDPOINT}?${params.toString()}`, {
      method: "POST",
    });
  } catch (error) {
    console.error("[meet] Failed to revoke Google tokens", error);
  }
}

export async function listGoogleMeetSpaces(
  userId: number,
  options: {
    pageSize?: number;
    pageToken?: string;
  } = {},
) {
  const accessToken = await getValidGoogleMeetAccessToken(userId);
  const params = new URLSearchParams();

  if (options.pageSize) params.set("pageSize", String(options.pageSize));
  if (options.pageToken) params.set("pageToken", options.pageToken);

  const response = await fetch(
    `https://meet.googleapis.com/v2/spaces${params.toString() ? `?${params.toString()}` : ""}`,
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
      `Failed to list Google Meet spaces: ${response.status} ${response.statusText} ${JSON.stringify(error)}`,
    );
  }

  return response.json() as Promise<{
    spaces?: Array<{
      name?: string;
      meetingCode?: string;
      meetingUri?: string;
      config?: Record<string, unknown>;
    }>;
    nextPageToken?: string;
  }>;
}

export async function createGoogleMeetSpace(
  userId: number,
  space: {
    topic: string;
    accessType?: "OPEN" | "TRUSTED_DOMAINS" | "INVITED";
    description?: string;
  },
) {
  const accessToken = await getValidGoogleMeetAccessToken(userId);

  const spacePayload: Record<string, unknown> = {};
  const accessTypeMap: Record<string, "OPEN" | "TRUSTED" | "RESTRICTED"> = {
    OPEN: "OPEN",
    TRUSTED_DOMAINS: "TRUSTED",
    INVITED: "RESTRICTED",
  };

  const mappedAccessType =
    space.accessType && accessTypeMap[space.accessType]
      ? accessTypeMap[space.accessType]
      : undefined;

  if (mappedAccessType) {
    spacePayload.config = {
      accessType: mappedAccessType,
    };
  }

  const response = await fetch("https://meet.googleapis.com/v2/spaces", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spacePayload),
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await safeJson(response);
    console.error("[meet] Failed to create space", {
      status: response.status,
      statusText: response.statusText,
      error,
    });
    throw new Error(
      `Failed to create Google Meet space: ${response.status} ${response.statusText} ${JSON.stringify(error)}`,
    );
  }

  return response.json() as Promise<{
    name?: string;
    meetingCode?: string;
    meetingUri?: string;
    config?: Record<string, unknown>;
  }>;
}

async function safeJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}


