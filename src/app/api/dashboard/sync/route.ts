import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";
import { fetchGoogleCalendarEvents } from "~/server/integrations/googleCalendar";
import {
  fetchGoogleGmailMessages,
  fetchGoogleGmailMessage,
} from "~/server/integrations/googleGmail";
import {
  getTodayISOStart,
  getTodayISOEnd,
  getTodayInIndia,
} from "~/server/utils/dateUtils";

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

type DashboardData = {
  today: {
    date: string;
    formatted: string;
  };
  calendar: {
    events: Array<{
      id: string;
      title: string;
      description?: string;
      start?: string;
      end?: string;
      location?: string;
      attendees?: string[];
    }>;
    count: number;
  };
  emails: {
    important: Array<{
      id: string;
      subject: string;
      from: string;
      date: string;
      snippet: string;
      threadId: string;
    }>;
    count: number;
  };
  tasks: Array<{
    id: number;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    startDate?: string | null;
    endDate?: string | null;
  }>;
  goals: Array<{
    id: number;
    title: string;
    description?: string | null;
    type: string;
    status: string;
    deadline?: string | null;
  }>;
  lastSyncAt: string;
};

// Function to fetch fresh dashboard data
async function fetchFreshDashboardData(userId: number): Promise<DashboardData> {
  const todayStart = getTodayISOStart();
  const todayEnd = getTodayISOEnd();
  const today = getTodayInIndia();

  // Fetch today's calendar events
  let todayEvents: CalendarEvent[] = [];
  try {
    const calendarResponse = (await fetchGoogleCalendarEvents(userId, {
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

  // Fetch top 5 important emails
  let importantEmails: Array<{
    id: string;
    subject: string;
    from: string;
    date: string;
    snippet: string;
    threadId: string;
  }> = [];
  try {
    const emailResult = await fetchGoogleGmailMessages(userId, {
      maxResults: 5,
      q: "is:important",
    });

    if (emailResult.messages && emailResult.messages.length > 0) {
      const messageDetails = await Promise.all(
        emailResult.messages.slice(0, 5).map(async (msg) => {
          try {
            const fullMessage = await fetchGoogleGmailMessage(userId, msg.id);
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
      importantEmails = messageDetails.filter(
        (msg): msg is NonNullable<typeof msg> => msg !== null,
      );
    }
  } catch (error) {
    console.error("[dashboard] Failed to fetch important emails", error);
  }

  // Fetch tasks for today
  const todayStartDate = new Date(todayStart);
  const todayEndDate = new Date(todayEnd);

  const tasks = await db.task.findMany({
    where: {
      userId,
      status: {
        in: ["pending", "in_progress"],
      },
      OR: [
        {
          startDate: {
            gte: todayStartDate,
            lte: todayEndDate,
          },
        },
        {
          endDate: {
            gte: todayStartDate,
            lte: todayEndDate,
          },
        },
        {
          AND: [
            {
              startDate: {
                lte: todayStartDate,
              },
            },
            {
              OR: [
                {
                  endDate: {
                    gte: todayEndDate,
                  },
                },
                {
                  endDate: null,
                },
              ],
            },
          ],
        },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      startDate: true,
      endDate: true,
    },
    orderBy: [
      { priority: "desc" },
      { startDate: "asc" },
    ],
    take: 10,
  });

  // Fetch ongoing goals
  const goals = await db.goal.findMany({
    where: {
      userId,
      status: {
        in: ["pending", "in_progress"],
      },
      OR: [
        {
          deadline: {
            gte: todayStartDate,
          },
        },
        {
          deadline: null,
        },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      status: true,
      deadline: true,
    },
    orderBy: [
      { deadline: "asc" },
      { createdAt: "desc" },
    ],
    take: 10,
  });

  return {
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
        id: event.id ?? "",
        title: event.summary ?? "Untitled Event",
        description: event.description,
        start: event.start?.dateTime ?? event.start?.date,
        end: event.end?.dateTime ?? event.end?.date,
        location: event.location,
        attendees: event.attendees?.map((a) => a.email).filter(Boolean) as string[],
      })),
      count: todayEvents.length,
    },
    emails: {
      important: importantEmails,
      count: importantEmails.length,
    },
    tasks: tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate?.toISOString() ?? null,
      endDate: task.endDate?.toISOString() ?? null,
    })),
    goals: goals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      description: goal.description,
      type: goal.type,
      status: goal.status,
      deadline: goal.deadline?.toISOString() ?? null,
    })),
    lastSyncAt: new Date().toISOString(),
  };
}

export async function POST() {
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

    // Fetch fresh data
    const dashboardData = await fetchFreshDashboardData(user.id);

    // Save to database
    await db.dashboardData.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        data: dashboardData as unknown as object,
        lastSyncAt: new Date(dashboardData.lastSyncAt),
      },
      update: {
        data: dashboardData as unknown as object,
        lastSyncAt: new Date(dashboardData.lastSyncAt),
      },
    });

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("[dashboard] Failed to sync dashboard data", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to sync dashboard data",
      },
      { status: 500 },
    );
  }
}

