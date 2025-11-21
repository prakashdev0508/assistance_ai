import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";
import { createGoogleCalendarEvent } from "~/server/integrations/googleCalendar";

type EventRequestBody = {
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
  attendees: Array<{ email: string }>;
};

export async function POST(request: NextRequest) {
  try {
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

    const body = (await request.json()) as unknown as EventRequestBody;

    // Validate required fields
    if (!body.summary) {
      return NextResponse.json(
        { error: "Event title is required" },
        { status: 400 },
      );
    }

    if (!body.start || (!body.start.dateTime && !body.start.date)) {
      return NextResponse.json(
        { error: "Start date/time is required" },
        { status: 400 },
      );
    }

    if (!body.end || (!body.end.dateTime && !body.end.date)) {
      return NextResponse.json(
        { error: "End date/time is required" },
        { status: 400 },
      );
    }

    if (!body.attendees || !Array.isArray(body.attendees) || body.attendees.length === 0) {
      return NextResponse.json(
        { error: "At least one attendee is required" },
        { status: 400 },
      );
    }

    // Validate attendee emails
    for (const attendee of body.attendees) {
      if (!attendee.email || typeof attendee.email !== "string") {
        return NextResponse.json(
          { error: "Invalid attendee format. Each attendee must have an email." },
          { status: 400 },
        );
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(attendee.email)) {
        return NextResponse.json(
          { error: `Invalid email format: ${attendee.email}` },
          { status: 400 },
        );
      }
    }

    const event = await createGoogleCalendarEvent(user.id, body);

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("[calendar] Failed to create event", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create calendar event",
      },
      { status: 500 },
    );
  }
}

