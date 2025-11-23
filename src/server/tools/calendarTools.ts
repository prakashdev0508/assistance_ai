import * as z from "zod";
import { tool } from "langchain";
import {
  fetchGoogleCalendarEvents,
  createGoogleCalendarEvent,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
} from "~/server/integrations/googleCalendar";

export function createCalendarTools(userId: number) {
  const listCalendarEvents = tool(
    async ({ timeMin, timeMax, maxResults }) => {
      try {
        const result = await fetchGoogleCalendarEvents(userId, {
          timeMin: timeMin as string | undefined,
          timeMax: timeMax as string | undefined,
          maxResults: maxResults as number | undefined,
          singleEvents: true,
          orderBy: "startTime",
        });

        const events = (result.items ?? []) as Array<{
          id?: string;
          summary?: string;
          description?: string;
          start?: { dateTime?: string; date?: string };
          end?: { dateTime?: string; date?: string };
          location?: string;
          attendees?: Array<{ email?: string }>;
        }>;

        if (events.length === 0) {
          return "No calendar events found for the specified time range.";
        }

        return JSON.stringify(
          events.map((event) => ({
            id: event.id,
            title: event.summary,
            description: event.description,
            start: event.start?.dateTime ?? event.start?.date,
            end: event.end?.dateTime ?? event.end?.date,
            location: event.location,
            attendees: event.attendees?.map((a) => a.email).filter(Boolean),
          })),
          null,
          2,
        );
      } catch (error) {
        return `Error fetching calendar events: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "list_calendar_events",
      description:
        "Retrieves calendar events for the authenticated user. Can filter by time range using ISO 8601 formatted dates. Returns comprehensive event details including title, description, start/end times, location, and attendee email addresses. Use this tool when the user asks about their schedule, upcoming events, or wants to view their calendar. The tool automatically scopes to the authenticated user's calendar only.",
      schema: z.object({
        timeMin: z
          .string()
          .optional()
          .describe(
            "Lower bound (exclusive) for an event's start time in ISO 8601 format (e.g., '2024-01-01T00:00:00Z')",
          ),
        timeMax: z
          .string()
          .optional()
          .describe(
            "Upper bound (exclusive) for an event's start time in ISO 8601 format (e.g., '2024-12-31T23:59:59Z')",
          ),
        maxResults: z
          .number()
          .optional()
          .describe("Maximum number of events to return (default: 20)"),
      }),
    },
  );

  const createCalendarEvent = tool(
    async ({
      summary,
      description,
      startDateTime,
      endDateTime,
      startDate,
      endDate,
      timeZone,
      location,
      attendees,
    }) => {
      try {
        const event: {
          summary: string;
          description?: string;
          start: { dateTime?: string; date?: string; timeZone?: string };
          end: { dateTime?: string; date?: string; timeZone?: string };
          location?: string;
          attendees?: Array<{ email: string }>;
        } = {
          summary: summary as string,
          start: { dateTime: startDateTime as string },
          end: { dateTime: endDateTime as string },
        };

        if (description) event.description = description as string;
        if (location) event.location = location as string;

        // Handle start time
        if (startDateTime) {
          event.start = { dateTime: startDateTime as string };
          if (timeZone) event.start.timeZone = timeZone as string;
        } else if (startDate) {
          event.start = { date: startDate as string };
        } else {
          return "Error: Either startDateTime or startDate is required.";
        }

        // Handle end time
        if (endDateTime) {
          event.end = { dateTime: endDateTime as string };
          if (timeZone) event.end.timeZone = timeZone as string;
        } else if (endDate) {
          event.end = { date: endDate as string };
        } else {
          return "Error: Either endDateTime or endDate is required.";
        }

        if (attendees && Array.isArray(attendees)) {
          event.attendees = (attendees as string[]).map((email) => ({
            email,
          }));
        }

        const result = await createGoogleCalendarEvent(userId, event);
        return `Successfully created calendar event: ${JSON.stringify(result, null, 2)}`;
      } catch (error) {
        return `Error creating calendar event: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "create_calendar_event",
      description:
        "Creates a new calendar event in the authenticated user's Google Calendar. Requires an event title (summary), start time, and end time. Supports both timed events (using dateTime) and all-day events (using date). Optional fields include description, location, timezone, and attendee email addresses. Always confirm event details with the user before creating. Validates email addresses for attendees. Use this when the user wants to schedule a meeting, create an event, or add something to their calendar.",
      schema: z.object({
        summary: z.string().describe("Event title/summary"),
        description: z.string().optional().describe("Event description"),
        startDateTime: z
          .string()
          .optional()
          .describe(
            "Start date and time in ISO 8601 format (e.g., '2024-01-15T10:00:00Z')",
          ),
        endDateTime: z
          .string()
          .optional()
          .describe(
            "End date and time in ISO 8601 format (e.g., '2024-01-15T11:00:00Z')",
          ),
        startDate: z
          .string()
          .optional()
          .describe(
            "Start date for all-day events in YYYY-MM-DD format (e.g., '2024-01-15')",
          ),
        endDate: z
          .string()
          .optional()
          .describe(
            "End date for all-day events in YYYY-MM-DD format (e.g., '2024-01-15')",
          ),
        timeZone: z
          .string()
          .optional()
          .describe(
            "Time zone (e.g., 'America/New_York', 'UTC'). Defaults to UTC if not specified.",
          ),
        location: z.string().optional().describe("Event location"),
        attendees: z
          .array(z.string())
          .optional()
          .describe("Array of attendee email addresses"),
      }),
    },
  );

  const updateCalendarEvent = tool(
    async ({
      eventId,
      summary,
      description,
      startDateTime,
      endDateTime,
      startDate,
      endDate,
      timeZone,
      location,
      attendees,
    }) => {
      try {
        const event: {
          summary?: string;
          description?: string;
          start?: { dateTime?: string; date?: string; timeZone?: string };
          end?: { dateTime?: string; date?: string; timeZone?: string };
          location?: string;
          attendees?: Array<{ email: string }>;
        } = {};

        if (summary) event.summary = summary as string;
        if (description) event.description = description as string;
        if (location) event.location = location as string;

        // Handle start time
        if (startDateTime) {
          event.start = { dateTime: startDateTime as string };
          if (timeZone) event.start.timeZone = timeZone as string;
        } else if (startDate) {
          event.start = { date: startDate as string };
        }

        // Handle end time
        if (endDateTime) {
          event.end = { dateTime: endDateTime as string };
          if (timeZone) event.end.timeZone = timeZone as string;
        } else if (endDate) {
          event.end = { date: endDate as string };
        }

        if (attendees && Array.isArray(attendees)) {
          event.attendees = (attendees as string[]).map((email) => ({
            email,
          }));
        }

        const result = await updateGoogleCalendarEvent(
          userId,
          eventId as string,
          event,
        );
        return `Successfully updated calendar event: ${JSON.stringify(result, null, 2)}`;
      } catch (error) {
        return `Error updating calendar event: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "update_calendar_event",
      description:
        "Updates an existing calendar event by its event ID. Only the fields provided will be updated - all parameters are optional except eventId. Supports updating title, description, start/end times, location, timezone, and attendees. Always confirm what will be changed before updating. Verify the event exists first by listing events. Use this when the user wants to modify an event (change time, location, add attendees, update details, etc.).",
      schema: z.object({
        eventId: z.string().describe("The ID of the event to update"),
        summary: z.string().optional().describe("Event title/summary"),
        description: z.string().optional().describe("Event description"),
        startDateTime: z
          .string()
          .optional()
          .describe(
            "Start date and time in ISO 8601 format (e.g., '2024-01-15T10:00:00Z')",
          ),
        endDateTime: z
          .string()
          .optional()
          .describe(
            "End date and time in ISO 8601 format (e.g., '2024-01-15T11:00:00Z')",
          ),
        startDate: z
          .string()
          .optional()
          .describe(
            "Start date for all-day events in YYYY-MM-DD format",
          ),
        endDate: z
          .string()
          .optional()
          .describe("End date for all-day events in YYYY-MM-DD format"),
        timeZone: z
          .string()
          .optional()
          .describe("Time zone (e.g., 'America/New_York', 'UTC')"),
        location: z.string().optional().describe("Event location"),
        attendees: z
          .array(z.string())
          .optional()
          .describe("Array of attendee email addresses"),
      }),
    },
  );

  const deleteCalendarEventTool = tool(
    async ({ eventId }) => {
      try {
        await deleteGoogleCalendarEvent(userId, eventId as string);
        return `Successfully deleted calendar event with ID: ${eventId}`;
      } catch (error) {
        return `Error deleting calendar event: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "delete_calendar_event",
      description:
        "Permanently deletes a calendar event by its event ID. This action cannot be undone. ALWAYS confirm with the user before deleting any event. Verify the event details first to ensure the correct event is being deleted. Use this only when the user explicitly requests to delete or cancel an event.",
      schema: z.object({
        eventId: z.string().describe("The ID of the event to delete"),
      }),
    },
  );

  return [
    listCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEventTool,
  ];
}

