import * as z from "zod";
import { tool } from "langchain";
import { db } from "~/server/db";

// Fuzzy search helper - calculates similarity between strings
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Simple Levenshtein-like similarity
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  
  // Count common words
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const commonWords = words1.filter((w) => words2.includes(w));
  const wordSimilarity = commonWords.length / Math.max(words1.length, words2.length);
  
  // Count common characters
  let commonChars = 0;
  for (const char of shorter) {
    if (longer.includes(char)) commonChars++;
  }
  const charSimilarity = commonChars / longer.length;
  
  return (wordSimilarity * 0.7 + charSimilarity * 0.3);
}

export function createJournalTools(userId: number) {
  const searchJournalEntries = tool(
    async ({ query, mood, tag, startDate, endDate, limit }) => {
      try {
        const searchQuery = (query as string)?.toLowerCase().trim() ?? "";
        const moodFilter = mood as string | undefined;
        const tagFilter = tag as string | undefined;
        const startDateFilter = startDate as string | undefined;
        const endDateFilter = endDate as string | undefined;
        const limitNum = (limit as number) ?? 20;

        // Build base where clause
        const where: {
          userId: number;
          mood?: string;
          tags?: { has: string };
          date?: { gte?: Date; lte?: Date };
        } = {
          userId,
        };

        if (moodFilter) {
          where.mood = moodFilter;
        }

        if (tagFilter) {
          where.tags = { has: tagFilter };
        }

        if (startDateFilter || endDateFilter) {
          where.date = {};
          if (startDateFilter) {
            where.date.gte = new Date(startDateFilter);
          }
          if (endDateFilter) {
            where.date.lte = new Date(endDateFilter);
          }
        }

        // Fetch all entries (we'll do fuzzy matching in memory for better results)
        let entries = await db.journalEntry.findMany({
          where,
          orderBy: {
            date: "desc",
          },
        });

        // If there's a search query, perform fuzzy matching
        if (searchQuery) {
          const entriesWithScores = entries.map((entry) => {
            const titleScore = entry.title
              ? calculateSimilarity(searchQuery, entry.title)
              : 0;
            const contentScore = calculateSimilarity(searchQuery, entry.content);

            const score = Math.max(titleScore, contentScore * 0.8);

            return { entry, score };
          });

          // Filter by minimum similarity threshold (0.3) and sort by score
          entries = entriesWithScores
            .filter(({ score }) => score >= 0.3)
            .sort((a, b) => b.score - a.score)
            .slice(0, limitNum)
            .map(({ entry }) => entry);
        } else {
          entries = entries.slice(0, limitNum);
        }

        if (entries.length === 0) {
          return "No journal entries found matching your search.";
        }

        return JSON.stringify(
          entries.map((entry) => ({
            id: entry.id,
            date: entry.date.toISOString().split("T")[0], // YYYY-MM-DD format
            title: entry.title,
            content: entry.content.substring(0, 200) + (entry.content.length > 200 ? "..." : ""), // Preview
            mood: entry.mood,
            tags: entry.tags,
          })),
          null,
          2,
        );
      } catch (error) {
        return `Error searching journal entries: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "search_journal_entries",
      description:
        "Searches for journal entries using fuzzy matching. Can search by content, title, mood, tags, or date range. Returns entries with their details. Use this when the user asks about journal entries, wants to find a specific entry, or mentions journal-related keywords. The search is intelligent and will find entries even with partial or similar text.",
      schema: z.object({
        query: z
          .string()
          .optional()
          .describe(
            "Search query to match against entry titles or content. Can be partial or similar text.",
          ),
        mood: z
          .string()
          .optional()
          .describe("Filter by mood (e.g., 'happy', 'grateful', 'anxious')"),
        tag: z
          .string()
          .optional()
          .describe("Filter by tag"),
        startDate: z
          .string()
          .optional()
          .describe("Start date in ISO 8601 format (YYYY-MM-DD) for date range filtering"),
        endDate: z
          .string()
          .optional()
          .describe("End date in ISO 8601 format (YYYY-MM-DD) for date range filtering"),
        limit: z
          .number()
          .optional()
          .describe("Maximum number of entries to return (default: 20)"),
      }),
    },
  );

  const getJournalEntry = tool(
    async ({ entryId, date }) => {
      try {
        let entry;

        if (entryId !== undefined) {
          entry = await db.journalEntry.findFirst({
            where: {
              id: entryId as number,
              userId,
            },
          });
        } else if (date !== undefined) {
          const entryDate = new Date(date as string);
          entry = await db.journalEntry.findUnique({
            where: {
              userId_date: {
                userId,
                date: entryDate,
              },
            },
          });
        } else {
          return "Error: Either entryId or date must be provided.";
        }

        if (!entry) {
          return `Journal entry not found.`;
        }

        return JSON.stringify(
          {
            id: entry.id,
            date: entry.date.toISOString().split("T")[0], // YYYY-MM-DD format
            title: entry.title,
            content: entry.content,
            mood: entry.mood,
            tags: entry.tags,
          },
          null,
          2,
        );
      } catch (error) {
        return `Error fetching journal entry: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "get_journal_entry",
      description:
        "Retrieves a specific journal entry by its ID or date. Use this when the user references an entry by ID or date, or when you need detailed information about a specific entry. Date should be in YYYY-MM-DD format.",
      schema: z.object({
        entryId: z.number().optional().describe("The ID of the entry to retrieve"),
        date: z
          .string()
          .optional()
          .describe("The date of the entry in YYYY-MM-DD format (e.g., '2024-01-15')"),
      }),
    },
  );

  const createJournalEntry = tool(
    async ({ date, title, content, mood, tags }) => {
      try {
        if (!content || typeof content !== "string") {
          return "Error: Content is required for journal entry.";
        }

        const entryDate = date ? new Date(date as string) : new Date();
        // Set to start of day to ensure consistent date matching
        entryDate.setHours(0, 0, 0, 0);

        // Check if entry already exists for this date
        const existingEntry = await db.journalEntry.findUnique({
          where: {
            userId_date: {
              userId,
              date: entryDate,
            },
          },
        });

        if (existingEntry) {
          return `A journal entry already exists for ${entryDate.toISOString().split("T")[0]}. Use update_journal_entry to modify it.`;
        }

        const entry = await db.journalEntry.create({
          data: {
            userId,
            date: entryDate,
            title: title as string | undefined,
            content: content as string,
            mood: mood as string | undefined,
            tags: (tags as string[]) ?? [],
          },
        });

        return JSON.stringify(
          {
            id: entry.id,
            date: entry.date.toISOString().split("T")[0],
            title: entry.title,
            content: entry.content.substring(0, 200) + (entry.content.length > 200 ? "..." : ""),
            mood: entry.mood,
            tags: entry.tags,
            message: "Journal entry created successfully",
          },
          null,
          2,
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("Unique constraint")
        ) {
          return "Error: A journal entry already exists for this date.";
        }
        return `Error creating journal entry: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "create_journal_entry",
      description:
        "Creates a new journal entry for a specific date. Always confirm entry details with the user before creating. Requires content. Optional fields include title, mood, and tags. If date is not provided, uses today's date. Only one entry per day is allowed per user.",
      schema: z.object({
        date: z
          .string()
          .optional()
          .describe("Date in YYYY-MM-DD format (defaults to today if not provided)"),
        title: z.string().optional().describe("Optional title for the entry"),
        content: z.string().describe("Journal entry content (required)"),
        mood: z
          .string()
          .optional()
          .describe("Optional mood indicator (e.g., 'happy', 'grateful', 'anxious', 'excited')"),
        tags: z
          .array(z.string())
          .optional()
          .describe("Optional array of tags for categorization"),
      }),
    },
  );

  const updateJournalEntry = tool(
    async ({ entryId, date, title, content, mood, tags }) => {
      try {
        let entry;

        // Find entry by ID or date
        if (entryId !== undefined) {
          entry = await db.journalEntry.findFirst({
            where: {
              id: entryId as number,
              userId,
            },
          });
        } else if (date !== undefined) {
          const entryDate = new Date(date as string);
          entryDate.setHours(0, 0, 0, 0);
          entry = await db.journalEntry.findUnique({
            where: {
              userId_date: {
                userId,
                date: entryDate,
              },
            },
          });
        } else {
          return "Error: Either entryId or date must be provided to update an entry.";
        }

        if (!entry) {
          return "Journal entry not found.";
        }

        const updateData: {
          date?: Date;
          title?: string | null;
          content?: string;
          mood?: string | null;
          tags?: string[];
        } = {};

        if (date !== undefined) {
          const newDate = new Date(date as string);
          newDate.setHours(0, 0, 0, 0);
          
          // Check if another entry exists for the new date
          if (newDate.getTime() !== entry.date.getTime()) {
            const existingEntry = await db.journalEntry.findUnique({
              where: {
                userId_date: {
                  userId,
                  date: newDate,
                },
              },
            });

            if (existingEntry) {
              return `A journal entry already exists for ${newDate.toISOString().split("T")[0]}. Cannot update date.`;
            }
          }
          
          updateData.date = newDate;
        }
        if (title !== undefined) updateData.title = (title as string) || null;
        if (content !== undefined) updateData.content = content as string;
        if (mood !== undefined) updateData.mood = (mood as string) || null;
        if (tags !== undefined) updateData.tags = tags as string[];

        const result = await db.journalEntry.updateMany({
          where: {
            id: entry.id,
            userId,
          },
          data: updateData,
        });

        if (result.count === 0) {
          return "Journal entry not found.";
        }

        const updatedEntry = await db.journalEntry.findUnique({
          where: { id: entry.id },
        });

        return JSON.stringify(
          {
            id: updatedEntry!.id,
            date: updatedEntry!.date.toISOString().split("T")[0],
            title: updatedEntry!.title,
            content: updatedEntry!.content.substring(0, 200) + (updatedEntry!.content.length > 200 ? "..." : ""),
            mood: updatedEntry!.mood,
            tags: updatedEntry!.tags,
            message: "Journal entry updated successfully",
          },
          null,
          2,
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("Unique constraint")
        ) {
          return "Error: A journal entry already exists for this date.";
        }
        return `Error updating journal entry: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "update_journal_entry",
      description:
        "Updates an existing journal entry. Only provided fields will be updated. Always confirm what will be changed before updating. Can identify entry by ID or date. Verify the entry exists first.",
      schema: z.object({
        entryId: z.number().optional().describe("The ID of the entry to update"),
        date: z
          .string()
          .optional()
          .describe("The date of the entry in YYYY-MM-DD format (alternative to entryId)"),
        title: z.string().optional().describe("Entry title"),
        content: z.string().optional().describe("Entry content"),
        mood: z
          .string()
          .optional()
          .describe("Mood indicator (set to empty string to remove)"),
        tags: z
          .array(z.string())
          .optional()
          .describe("Array of tags"),
      }),
    },
  );

  const deleteJournalEntry = tool(
    async ({ entryId, date }) => {
      try {
        let entry;

        if (entryId !== undefined) {
          entry = await db.journalEntry.findFirst({
            where: {
              id: entryId as number,
              userId,
            },
          });
        } else if (date !== undefined) {
          const entryDate = new Date(date as string);
          entryDate.setHours(0, 0, 0, 0);
          entry = await db.journalEntry.findUnique({
            where: {
              userId_date: {
                userId,
                date: entryDate,
              },
            },
          });
        } else {
          return "Error: Either entryId or date must be provided to delete an entry.";
        }

        if (!entry) {
          return "Journal entry not found.";
        }

        const result = await db.journalEntry.deleteMany({
          where: {
            id: entry.id,
            userId,
          },
        });

        if (result.count === 0) {
          return "Journal entry not found.";
        }

        return JSON.stringify(
          {
            message: "Journal entry deleted successfully",
          },
          null,
          2,
        );
      } catch (error) {
        return `Error deleting journal entry: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "delete_journal_entry",
      description:
        "Permanently deletes a journal entry. ALWAYS confirm with the user before deleting. This action cannot be undone. Can identify entry by ID or date.",
      schema: z.object({
        entryId: z.number().optional().describe("The ID of the entry to delete"),
        date: z
          .string()
          .optional()
          .describe("The date of the entry in YYYY-MM-DD format (alternative to entryId)"),
      }),
    },
  );

  const getJournalStats = tool(
    async () => {
      try {
        const entries = await db.journalEntry.findMany({
          where: {
            userId,
          },
          select: {
            date: true,
            mood: true,
            tags: true,
          },
        });

        const totalEntries = entries.length;

        // Calculate mood distribution
        const moodCounts: Record<string, number> = {};
        entries.forEach((entry) => {
          if (entry.mood) {
            moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
          }
        });

        // Calculate tag frequency
        const tagCounts: Record<string, number> = {};
        entries.forEach((entry) => {
          entry.tags.forEach((tag) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        });

        // Get most used tags (top 5)
        const mostUsedTags = Object.entries(tagCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([tag, count]) => ({ tag, count }));

        // Calculate streak (consecutive days with entries)
        const sortedDates = entries
          .map((e) => e.date)
          .sort((a, b) => b.getTime() - a.getTime());

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < sortedDates.length; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);
          checkDate.setHours(0, 0, 0, 0);
          
          const hasEntry = sortedDates.some(
            (d) => d.getTime() === checkDate.getTime(),
          );
          
          if (hasEntry) {
            streak++;
          } else {
            break;
          }
        }

        return JSON.stringify(
          {
            totalEntries,
            streak,
            moodDistribution: moodCounts,
            mostUsedTags,
          },
          null,
          2,
        );
      } catch (error) {
        return `Error fetching journal stats: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "get_journal_stats",
      description:
        "Retrieves statistics about the user's journal entries including total entries, current streak, mood distribution, and most used tags. Use this when the user asks about their journal statistics, patterns, or insights.",
      schema: z.object({}),
    },
  );

  return [
    searchJournalEntries,
    getJournalEntry,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    getJournalStats,
  ];
}

