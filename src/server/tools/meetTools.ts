import * as z from "zod";
import { tool } from "langchain";
import {
  listGoogleMeetSpaces,
  createGoogleMeetSpace,
} from "~/server/integrations/googleMeet";

export function createMeetTools(userId: number) {
  const listMeetSpaces = tool(
    async ({ pageSize, pageToken }) => {
      try {
        const spaces = await listGoogleMeetSpaces(userId, {
          pageSize: pageSize as number | undefined,
          pageToken: pageToken as string | undefined,
        });

        if (!spaces.spaces?.length) {
          return "No Google Meet spaces found.";
        }

        return JSON.stringify(
          spaces.spaces.map((space) => ({
            name: space.name,
            meetingCode: space.meetingCode,
            meetingUri: space.meetingUri,
            config: space.config,
          })),
          null,
          2,
        );
      } catch (error) {
        return `Error listing Google Meet spaces: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      }
    },
    {
      name: "list_google_meet_spaces",
      description:
        "Lists Google Meet spaces (meeting rooms) created by the authenticated user. Use this to reference existing meeting codes or provide join links.",
      schema: z.object({
        pageSize: z.number().optional().describe("Maximum number of spaces to return (default 20)"),
        pageToken: z.string().optional().describe("Pagination token from a previous response"),
      }),
    },
  );

  const createMeetSpace = tool(
    async ({ topic, description, accessType }) => {
      try {
        const space = await createGoogleMeetSpace(userId, {
          topic: topic as string,
          description: description as string | undefined,
          accessType: accessType as "OPEN" | "TRUSTED_DOMAINS" | "INVITED" | undefined,
        });

        return JSON.stringify(
          {
            status: "created",
            meetingCode: space.meetingCode,
            meetingUri: space.meetingUri,
            name: space.name,
          },
          null,
          2,
        );
      } catch (error) {
        return `Error creating Google Meet space: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      }
    },
    {
      name: "create_google_meet_space",
      description:
        "Creates a brand-new Google Meet space (meeting link). Always confirm the agenda, participants, and access policy with the user BEFORE calling this tool.",
      schema: z.object({
        topic: z.string().describe("Display name for the meeting (e.g., 'Weekly Sync')"),
        description: z.string().optional().describe("Optional description or agenda"),
        accessType: z
          .enum(["OPEN", "TRUSTED_DOMAINS", "INVITED"])
          .optional()
          .describe("Who can join the meeting. Defaults to TRUSTED_DOMAINS."),
      }),
    },
  );

  return [listMeetSpaces, createMeetSpace];
}


