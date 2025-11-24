import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/lib/auth";
import { env } from "~/env";
import { GOOGLE_MEET_SCOPES } from "~/server/integrations/googleMeet";

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const STATE_COOKIE_NAME = "gm_oauth_state";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login?intent=meet", request.nextUrl.origin));
  }

  const callbackUrl = buildCallbackUrl(request);
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: GOOGLE_MEET_SCOPES,
    access_type: "offline",
    include_granted_scopes: "true",
    prompt: "consent",
    state,
  });

  const response = NextResponse.redirect(`${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`);

  response.cookies.set({
    name: STATE_COOKIE_NAME,
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}

function buildCallbackUrl(request: NextRequest) {
  const baseUrl = env.NEXTAUTH_URL ?? request.nextUrl.origin;
  return `${baseUrl}/api/integrations/google/meet/callback`;
}


