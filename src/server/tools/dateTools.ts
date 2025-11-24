import * as z from "zod";
import { tool } from "langchain";
import {
  getTodayInIndia,
  getTodayISOStart,
  getTodayISOEnd,
  formatDateForDisplay,
  formatTimeForDisplay,
} from "~/server/utils/dateUtils";

export function createDateTools() {
  const getTodayDate = tool(
    async () => {
      try {
        // Get current date/time in IST
        const now = new Date();
        const istDateString = now.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });

        const istDateFormatted = now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "Asia/Kolkata",
        });

        const istTimeFormatted = now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        });

        // Get start and end of today in IST
        const todayStart = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        todayStart.setHours(0, 0, 0, 0);
        const todayStartISO = new Date(todayStart.getTime() - (todayStart.getTimezoneOffset() * 60000)).toISOString();

        const todayEnd = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        todayEnd.setHours(23, 59, 59, 999);
        const todayEndISO = new Date(todayEnd.getTime() - (todayEnd.getTimezoneOffset() * 60000)).toISOString();

        // Current date/time in ISO format (IST converted to UTC)
        const currentISO = now.toISOString();

        return JSON.stringify(
          {
            currentDateTime: currentISO,
            currentDateTimeIST: istDateString,
            formattedDate: istDateFormatted,
            formattedTime: istTimeFormatted,
            isoStart: todayStartISO,
            isoEnd: todayEndISO,
            timezone: "Asia/Kolkata (IST)",
            dayOfWeek: now.toLocaleDateString("en-US", {
              weekday: "long",
              timeZone: "Asia/Kolkata",
            }),
            year: now.toLocaleDateString("en-US", {
              year: "numeric",
              timeZone: "Asia/Kolkata",
            }),
            month: now.toLocaleDateString("en-US", {
              month: "long",
              timeZone: "Asia/Kolkata",
            }),
            day: now.toLocaleDateString("en-US", {
              day: "numeric",
              timeZone: "Asia/Kolkata",
            }),
          },
          null,
          2,
        );
      } catch (error) {
        return `Error getting today's date: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "get_today_date",
      description:
        "Gets the current date and time in India timezone (Asia/Kolkata/IST). Returns formatted date, time, ISO timestamps for current time and start/end of day, and timezone information. Use this when the user asks about 'today', 'current date', 'current time', 'now', or needs date information for calendar queries, task scheduling, or any time-sensitive operations.",
      schema: z.object({}),
    },
  );

  return [getTodayDate];
}

