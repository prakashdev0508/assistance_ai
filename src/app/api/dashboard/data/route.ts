import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";
import { fetchGoogleCalendarEvents } from "~/server/integrations/googleCalendar";

type CalendarEvent = {
  id?: string;
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
    email?: string;
  }>;
};
import {
  fetchGoogleGmailMessages,
  fetchGoogleGmailMessage,
} from "~/server/integrations/googleGmail";
import {
  getTodayISOStart,
  getTodayISOEnd,
  getTodayInIndia,
} from "~/server/utils/dateUtils";

export async function GET() {
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

    // Get today's date range in India timezone
    const todayStart = getTodayISOStart();
    const todayEnd = getTodayISOEnd();
    const today = getTodayInIndia();

    // Fetch today's calendar events
    let todayEvents: CalendarEvent[] = [];
    try {
      const calendarResponse = (await fetchGoogleCalendarEvents(user.id, {
        timeMin: todayStart,
        timeMax: todayEnd,
        maxResults: 50,
        singleEvents: true,
        orderBy: "startTime",
      })) as { items?: CalendarEvent[] };

      if (Array.isArray(calendarResponse?.items)) {
        todayEvents = calendarResponse.items;
      }
    } catch (error) {
      console.error("[dashboard] Failed to fetch calendar events", error);
    }

    // Fetch unread important emails
    let unreadImportantEmails: Array<{
      id: string;
      subject: string;
      from: string;
      date: string;
      snippet: string;
      threadId: string;
    }> = [];
    try {
      const unreadResult = await fetchGoogleGmailMessages(user.id, {
        maxResults: 20,
        q: "is:unread is:important",
      });

      if (unreadResult.messages && unreadResult.messages.length > 0) {
        const messageDetails = await Promise.all(
          unreadResult.messages.slice(0, 10).map(async (msg) => {
            try {
              const fullMessage = await fetchGoogleGmailMessage(user.id, msg.id);
              return {
                id: fullMessage.id,
                threadId: fullMessage.threadId,
                snippet: fullMessage.snippet ?? "",
                subject:
                  fullMessage.payload?.headers?.find(
                    (h) => h.name.toLowerCase() === "subject",
                  )?.value ?? "",
                from:
                  fullMessage.payload?.headers?.find(
                    (h) => h.name.toLowerCase() === "from",
                  )?.value ?? "",
                date:
                  fullMessage.payload?.headers?.find(
                    (h) => h.name.toLowerCase() === "date",
                  )?.value ?? "",
              };
            } catch {
              return null;
            }
          }),
        );
        unreadImportantEmails = messageDetails.filter(
          (msg): msg is NonNullable<typeof msg> => msg !== null,
        );
      }
    } catch (error) {
      console.error("[dashboard] Failed to fetch unread emails", error);
    }

    // Fetch unanswered important emails (emails that need a reply)
    let unansweredImportantEmails: Array<{
      id: string;
      subject: string;
      from: string;
      date: string;
      snippet: string;
      threadId: string;
    }> = [];
    try {
      // Search for important emails that are not in sent folder and might need replies
      const unansweredResult = await fetchGoogleGmailMessages(user.id, {
        maxResults: 20,
        q: "is:important -in:sent -is:unread",
      });

      if (unansweredResult.messages && unansweredResult.messages.length > 0) {
        const messageDetails = await Promise.all(
          unansweredResult.messages.slice(0, 10).map(async (msg) => {
            try {
              const fullMessage = await fetchGoogleGmailMessage(user.id, msg.id);
              return {
                id: fullMessage.id,
                threadId: fullMessage.threadId,
                snippet: fullMessage.snippet ?? "",
                subject:
                  fullMessage.payload?.headers?.find(
                    (h) => h.name.toLowerCase() === "subject",
                  )?.value ?? "",
                from:
                  fullMessage.payload?.headers?.find(
                    (h) => h.name.toLowerCase() === "from",
                  )?.value ?? "",
                date:
                  fullMessage.payload?.headers?.find(
                    (h) => h.name.toLowerCase() === "date",
                  )?.value ?? "",
              };
            } catch {
              return null;
            }
          }),
        );
        unansweredImportantEmails = messageDetails.filter(
          (msg): msg is NonNullable<typeof msg> => msg !== null,
        );
      }
    } catch (error) {
      console.error("[dashboard] Failed to fetch unanswered emails", error);
    }

    return NextResponse.json({
      today: {
        date: today.toISOString(),
        formatted: today.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "Asia/Kolkata",
        }),
      },
      calendar: {
        events: todayEvents.map((event) => ({
          id: event.id,
          title: event.summary,
          description: event.description,
          start: event.start?.dateTime ?? event.start?.date,
          end: event.end?.dateTime ?? event.end?.date,
          location: event.location,
          attendees: event.attendees?.map((a) => a.email).filter(Boolean),
        })),
        count: todayEvents.length,
      },
      emails: {
        unreadImportant: unreadImportantEmails,
        unreadImportantCount: unreadImportantEmails.length,
        unansweredImportant: unansweredImportantEmails,
        unansweredImportantCount: unansweredImportantEmails.length,
      },
    });
  } catch (error) {
    console.error("[dashboard] Failed to fetch dashboard data", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard data",
      },
      { status: 500 },
    );
  }
}

