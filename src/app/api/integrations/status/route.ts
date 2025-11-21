import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";
import { GOOGLE_CALENDAR_PROVIDER } from "~/server/integrations/googleCalendar";

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

  const integration = await db.integration.findUnique({
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
  });

  return NextResponse.json({
    integrations: {
      [GOOGLE_CALENDAR_PROVIDER]: integration
        ? {
            connected: true,
            scope: integration.scope,
            expiresAt: integration.expiresAt,
            connectedAt: integration.createdAt,
            updatedAt: integration.updatedAt,
          }
        : { connected: false },
    },
  });
}

