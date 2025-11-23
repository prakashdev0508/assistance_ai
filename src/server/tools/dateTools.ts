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
        const today = getTodayInIndia();
        const formatted = formatDateForDisplay(today);
        const time = formatTimeForDisplay(today);
        const isoStart = getTodayISOStart();
        const isoEnd = getTodayISOEnd();

        return JSON.stringify(
          {
            date: today.toISOString(),
            formatted: formatted,
            time: time,
            isoStart: isoStart,
            isoEnd: isoEnd,
            timezone: "Asia/Kolkata (IST)",
            dayOfWeek: today.toLocaleDateString("en-US", {
              weekday: "long",
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
        "Gets today's date and time in India timezone (Asia/Kolkata/IST). Returns formatted date, time, ISO timestamps for start/end of day, and timezone information. Use this when the user asks about 'today', 'current date', or needs date information for calendar queries.",
      schema: z.object({}),
    },
  );

  return [getTodayDate];
}

