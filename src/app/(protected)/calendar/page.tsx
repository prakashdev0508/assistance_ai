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

type DayData = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
};

function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const dateStr = date.toISOString().split("T")[0] ?? "";
  return events.filter((event) => {
    let eventDate: string;
    if (event.start.dateTime) {
      eventDate = new Date(event.start.dateTime).toISOString().split("T")[0] ?? "";
    } else if (event.start.date) {
      eventDate = event.start.date;
    } else {
      return false;
    }
    return eventDate === dateStr;
  });
}

function getCalendarDays(year: number, month: number, events: CalendarEvent[]): DayData[] {
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

  const days: DayData[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    currentDate.setHours(0, 0, 0, 0);

    const isCurrentMonth = currentDate.getMonth() === month;
    const isToday = currentDate.getTime() === today.getTime();
    const dayEvents = isCurrentMonth ? getEventsForDate(events, currentDate) : [];

    days.push({
      date: currentDate,
      isCurrentMonth,
      isToday,
      events: dayEvents,
    });
  }

  return days;
}

function formatEventTime(event: CalendarEvent): string {
  if (event.start.dateTime) {
    const start = new Date(event.start.dateTime);
    return start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  return "All day";
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
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

  // Get current month/year or from searchParams
  const params = await searchParams;
  const now = new Date();
  const currentYear = params.year ? parseInt(params.year) : now.getFullYear();
  const currentMonth = params.month ? parseInt(params.month) : now.getMonth();

  // Calculate month boundaries
  const monthStart = new Date(currentYear, currentMonth, 1);
  const monthEnd = new Date(currentYear, currentMonth + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);

  let events: CalendarEvent[] = [];
  let error: string | null = null;

  try {
    const timeMin = monthStart.toISOString();
    const timeMax = monthEnd.toISOString();

    const response = (await fetchGoogleCalendarEvents(user.id, {
      timeMin,
      timeMax,
      maxResults: 250,
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

  const calendarDays = getCalendarDays(currentYear, currentMonth, events);
  const monthName = monthStart.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Calculate previous and next month
  const prevMonth = new Date(currentYear, currentMonth - 1, 1);
  const nextMonth = new Date(currentYear, currentMonth + 1, 1);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

      {/* Month Navigation */}
      <div className="flex items-center justify-between rounded-[20px] border border-white/60 bg-white/80 p-4 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)] backdrop-blur">
        <div className="flex items-center gap-2">
          <Link
            href={`/calendar?month=${prevMonth.getMonth()}&year=${prevMonth.getFullYear()}`}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <Link
            href={`/calendar?month=${now.getMonth()}&year=${now.getFullYear()}`}
            className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 transition-colors"
          >
            Today
          </Link>
        </div>
        <h2 className="text-xl font-semibold text-black">{monthName}</h2>
        <Link
          href={`/calendar?month=${nextMonth.getMonth()}&year=${nextMonth.getFullYear()}`}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-[20px] border border-white/60 bg-white/80 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)] backdrop-blur overflow-hidden">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {weekDays.map((day) => (
            <div
              key={day}
              className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[140px] border-r border-b border-gray-100 p-2 transition-colors hover:bg-gray-50 ${
                day.isCurrentMonth ? "bg-white" : "bg-gray-50/50"
              } ${index % 7 === 6 ? "border-r-0" : ""}`}
            >
              <div
                className={`mb-1.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  day.isToday
                    ? "bg-[#4285F4] text-white font-semibold"
                    : day.isCurrentMonth
                      ? "text-gray-900 hover:bg-gray-100"
                      : "text-gray-400"
                }`}
              >
                {day.date.getDate()}
              </div>
              <div className="space-y-1">
                {day.events.slice(0, 3).map((event) => (
                  <a
                    key={event.id}
                    href={event.htmlLink ?? "#"}
                    target={event.htmlLink ? "_blank" : undefined}
                    rel={event.htmlLink ? "noopener noreferrer" : undefined}
                    className="block truncate rounded px-1.5 py-0.5 text-xs text-white bg-[#4285F4] hover:bg-[#3367d6] transition-colors cursor-pointer"
                    title={`${formatEventTime(event)} - ${event.summary || "No title"}`}
                  >
                    <span className="font-medium">{formatEventTime(event)}</span>{" "}
                    <span className="truncate">{event.summary || "No title"}</span>
                  </a>
                ))}
                {day.events.length > 3 && (
                  <div className="px-1.5 py-0.5 text-xs text-gray-600 font-medium">
                    +{day.events.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
