import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";
import { GOOGLE_CALENDAR_PROVIDER } from "~/server/integrations/googleCalendar";
import { GOOGLE_GMAIL_PROVIDER } from "~/server/integrations/googleGmail";

export async function GET() {
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

  const [calendarIntegration, gmailIntegration] = await Promise.all([
    db.integration.findUnique({
      where: {
        userId_provider: {
          userId: user.id,
          provider: GOOGLE_CALENDAR_PROVIDER,
        },
      },
      select: {
        id: true,
        scope: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    db.integration.findUnique({
      where: {
        userId_provider: {
          userId: user.id,
          provider: GOOGLE_GMAIL_PROVIDER,
        },
      },
      select: {
        id: true,
        scope: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return NextResponse.json({
    integrations: {
      [GOOGLE_CALENDAR_PROVIDER]: calendarIntegration
        ? {
            connected: true,
            scope: calendarIntegration.scope,
            expiresAt: calendarIntegration.expiresAt,
            connectedAt: calendarIntegration.createdAt,
            updatedAt: calendarIntegration.updatedAt,
          }
        : { connected: false },
      [GOOGLE_GMAIL_PROVIDER]: gmailIntegration
        ? {
            connected: true,
            scope: gmailIntegration.scope,
            expiresAt: gmailIntegration.expiresAt,
            connectedAt: gmailIntegration.createdAt,
            updatedAt: gmailIntegration.updatedAt,
          }
        : { connected: false },
    },
  });
}

