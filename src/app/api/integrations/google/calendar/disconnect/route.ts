import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";
import {
  getGoogleCalendarIntegration,
  revokeGoogleCalendarIntegration,
} from "~/server/integrations/googleCalendar";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.redirect(
      new URL("/login?intent=calendar", request.nextUrl.origin),
    );
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.redirect(
      new URL("/integrations?calendar=user_not_found", request.nextUrl.origin),
    );
  }

  const integration = await getGoogleCalendarIntegration(user.id);

  if (integration) {
    await revokeGoogleCalendarIntegration(integration);
    await db.integration.delete({
      where: {
        id: integration.id,
      },
    });
  }

  return NextResponse.redirect(
    new URL("/integrations?calendar=disconnected", request.nextUrl.origin),
  );
}

