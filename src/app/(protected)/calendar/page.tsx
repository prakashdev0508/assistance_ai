import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";
import {
  GOOGLE_CALENDAR_PROVIDER,
  fetchGoogleCalendarEvents,
} from "~/server/integrations/googleCalendar";
import AddEventButton from "~/components/calendar/AddEventButton";

type CalendarEvent = {
  id: string;
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
  htmlLink?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
};

function formatEventTime(event: CalendarEvent): string {
  if (event.start.dateTime) {
    const start = new Date(event.start.dateTime);
    const end = event.end.dateTime ? new Date(event.end.dateTime) : null;

    const startTime = start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (end) {
      const endTime = end.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return `${startTime} - ${endTime}`;
    }

    return startTime;
  }

  if (event.start.date) {
    return "All day";
  }

  return "No time specified";
}

function formatEventDate(event: CalendarEvent): string {
  if (event.start.dateTime) {
    const date = new Date(event.start.dateTime);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (event.start.date) {
    const date = new Date(event.start.date);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return "Date not specified";
}

function isEventToday(event: CalendarEvent): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let eventDate: Date;
  if (event.start.dateTime) {
    eventDate = new Date(event.start.dateTime);
  } else if (event.start.date) {
    eventDate = new Date(event.start.date);
  } else {
    return false;
  }

  eventDate.setHours(0, 0, 0, 0);
  return eventDate.getTime() === today.getTime();
}

function isEventUpcoming(event: CalendarEvent): boolean {
  const now = new Date();

  let eventDate: Date;
  if (event.start.dateTime) {
    eventDate = new Date(event.start.dateTime);
  } else if (event.start.date) {
    eventDate = new Date(event.start.date);
    eventDate.setHours(23, 59, 59, 999);
  } else {
    return false;
  }

  return eventDate.getTime() > now.getTime();
}

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
  }

  const calendarIntegration = await db.integration.findUnique({
    where: {
      userId_provider: {
        userId: user.id,
        provider: GOOGLE_CALENDAR_PROVIDER,
      },
    },
  });

  if (!calendarIntegration) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-black">Calendar</h1>
          <p className="text-sm text-black/60">
            View and manage your Google Calendar events
          </p>
        </div>
        <div className="rounded-[28px] border border-white/60 bg-white/80 p-8 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] backdrop-blur text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4285F4] text-white">
              <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                <path
                  d="M7 4h10v4H7zM5 8h14v12H5z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-black">
                Google Calendar not connected
              </h2>
              <p className="mt-2 text-sm text-black/60">
                Connect your Google Calendar to view your events and meetings
              </p>
            </div>
            <Link
              href="/integrations"
              className="mt-4 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/90"
            >
              Connect Calendar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let events: CalendarEvent[] = [];
  let error: string | null = null;

  try {
    const timeMin = new Date().toISOString();
    const timeMax = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const response = (await fetchGoogleCalendarEvents(user.id, {
      timeMin,
      timeMax,
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
    })) as { items?: CalendarEvent[] };

    if (Array.isArray(response?.items)) {
      events = response.items;
    } else {
      events = [];
    }
  } catch (err) {
    console.error("[calendar] Failed to fetch events", err);
    error =
      err instanceof Error
        ? err.message
        : "Failed to fetch calendar events";
  }

  const todayEvents = events.filter(isEventToday);
  const upcomingEvents = events.filter(
    (e) => !isEventToday(e) && isEventUpcoming(e),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-black">Calendar</h1>
          <p className="text-sm text-black/60">
            View and manage your Google Calendar events
          </p>
        </div>
        <AddEventButton />
      </div>

      {error && (
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">Error loading events</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {!error && events.length === 0 && (
        <div className="rounded-[28px] border border-white/60 bg-white/80 p-8 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] backdrop-blur text-center">
          <p className="text-black/60">No upcoming events found</p>
        </div>
      )}

      {todayEvents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-black">Today</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todayEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-[20px] border border-white/60 bg-white/80 p-5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)] backdrop-blur hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.4)] transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-black truncate">
                      {event.summary || "No title"}
                    </h3>
                    <p className="mt-1 text-xs text-black/60">
                      {formatEventTime(event)}
                    </p>
                    {event.location && (
                      <p className="mt-2 text-xs text-black/50 flex items-center gap-1">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </p>
                    )}
                    {event.attendees && event.attendees.length > 0 && (
                      <p className="mt-2 text-xs text-black/50">
                        {event.attendees.length}{" "}
                        {event.attendees.length === 1 ? "attendee" : "attendees"}
                      </p>
                    )}
                  </div>
                  {event.htmlLink && (
                    <a
                      href={event.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-[#4285F4] hover:text-[#3367d6] transition-colors"
                      aria-label="Open in Google Calendar"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                </div>
                {event.description && (
                  <p className="mt-3 text-xs text-black/70 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {upcomingEvents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-black">Upcoming</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-[20px] border border-white/60 bg-white/80 p-5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)] backdrop-blur hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.4)] transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-black truncate">
                      {event.summary || "No title"}
                    </h3>
                    <p className="mt-1 text-xs text-black/60">
                      {formatEventDate(event)}
                    </p>
                    <p className="mt-1 text-xs text-black/50">
                      {formatEventTime(event)}
                    </p>
                    {event.location && (
                      <p className="mt-2 text-xs text-black/50 flex items-center gap-1">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </p>
                    )}
                    {event.attendees && event.attendees.length > 0 && (
                      <p className="mt-2 text-xs text-black/50">
                        {event.attendees.length}{" "}
                        {event.attendees.length === 1 ? "attendee" : "attendees"}
                      </p>
                    )}
                  </div>
                  {event.htmlLink && (
                    <a
                      href={event.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-[#4285F4] hover:text-[#3367d6] transition-colors"
                      aria-label="Open in Google Calendar"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                </div>
                {event.description && (
                  <p className="mt-3 text-xs text-black/70 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

