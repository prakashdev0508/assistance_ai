import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/lib/auth";
import { env } from "~/env";
import { db } from "~/server/db";
import {
  GOOGLE_CALENDAR_PROVIDER,
  GOOGLE_CALENDAR_SCOPES,
  getGoogleCalendarIntegration,
} from "~/server/integrations/googleCalendar";

const STATE_COOKIE_NAME = "gc_oauth_state";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

export async function GET(request: NextRequest) {
  const baseRedirect = new URL("/integrations", request.nextUrl.origin);

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login?intent=calendar", baseRedirect));
  }

  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get(STATE_COOKIE_NAME)?.value;
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return redirectWithStatus(baseRedirect, "error");
  }

  if (!code || !state || state !== storedState) {
    return redirectWithStatus(baseRedirect, "invalid_state");
  }

  const callbackUrl = buildCallbackUrl(request);

  const params = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: callbackUrl,
    grant_type: "authorization_code",
  });

  const tokenResponse = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!tokenResponse.ok) {
    return redirectWithStatus(baseRedirect, "token_error");
  }

  const tokenJson = (await tokenResponse.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
  };

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return redirectWithStatus(baseRedirect, "user_not_found");
  }

  const existing = await getGoogleCalendarIntegration(user.id);
  const refreshToken = tokenJson.refresh_token ?? existing?.refreshToken;

  if (!refreshToken) {
    return redirectWithStatus(baseRedirect, "missing_refresh_token");
  }

  const expiresAt = new Date(Date.now() + (tokenJson.expires_in ?? 3600) * 1000);

  await db.integration.upsert({
    where: {
      userId_provider: {
        userId: user.id,
        provider: GOOGLE_CALENDAR_PROVIDER,
      },
    },
    update: {
      accessToken: tokenJson.access_token,
      refreshToken,
      scope: tokenJson.scope ?? GOOGLE_CALENDAR_SCOPES,
      expiresAt,
    },
    create: {
      userId: user.id,
      provider: GOOGLE_CALENDAR_PROVIDER,
      accessToken: tokenJson.access_token,
      refreshToken,
      scope: tokenJson.scope ?? GOOGLE_CALENDAR_SCOPES,
      expiresAt,
    },
  });

  const response = redirectWithStatus(baseRedirect, "connected");
  response.cookies.set({
    name: STATE_COOKIE_NAME,
    value: "",
    path: "/",
    expires: new Date(0),
  });

  return response;
}

function redirectWithStatus(baseUrl: URL, status: string) {
  baseUrl.searchParams.set("calendar", status);
  const response = NextResponse.redirect(baseUrl);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function buildCallbackUrl(request: NextRequest) {
  const baseUrl = env.NEXTAUTH_URL ?? request.nextUrl.origin;
  return `${baseUrl}/api/integrations/google/calendar/callback`;
}

