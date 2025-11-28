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

export function createGoalTools(userId: number) {
  const searchGoals = tool(
    async ({ query, type, status, limit }) => {
      try {
        const searchQuery = (query as string)?.toLowerCase().trim() ?? "";
        const typeFilter = type as string | undefined;
        const statusFilter = status as string | undefined;
        const limitNum = (limit as number) ?? 20;

        // Build base where clause
        const where: {
          userId: number;
          type?: string;
          status?: string;
        } = {
          userId,
        };

        if (typeFilter) {
          where.type = typeFilter;
        }

        if (statusFilter) {
          where.status = statusFilter;
        }

        // Fetch all goals (we'll do fuzzy matching in memory for better results)
        let goals = await db.goal.findMany({
          where,
          orderBy: [
            { deadline: "asc" },
            { createdAt: "desc" },
          ],
        });

        // If there's a search query, perform fuzzy matching
        if (searchQuery) {
          const goalsWithScores = goals.map((goal) => {
            const titleScore = calculateSimilarity(searchQuery, goal.title);
            const descScore = goal.description
              ? calculateSimilarity(searchQuery, goal.description)
              : 0;

            const score = Math.max(titleScore, descScore * 0.7);

            return { goal, score };
          });

          // Filter by minimum similarity threshold (0.3) and sort by score
          goals = goalsWithScores
            .filter(({ score }) => score >= 0.3)
            .sort((a, b) => b.score - a.score)
            .slice(0, limitNum)
            .map(({ goal }) => goal);
        } else {
          goals = goals.slice(0, limitNum);
        }

        if (goals.length === 0) {
          return "No goals found matching your search.";
        }

        return JSON.stringify(
          goals.map((goal) => ({
            id: goal.id,
            title: goal.title,
            description: goal.description,
            type: goal.type,
            deadline: goal.deadline?.toISOString(),
            status: goal.status,
          })),
          null,
          2,
        );
      } catch (error) {
        return `Error searching goals: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "search_goals",
      description:
        "Searches for goals using fuzzy matching. Can search by title or description. Returns goals with their details. Use this when the user asks about goals, wants to find a specific goal, or mentions goal-related keywords. The search is intelligent and will find goals even with partial or similar text.",
      schema: z.object({
        query: z
          .string()
          .optional()
          .describe(
            "Search query to match against goal titles or descriptions. Can be partial or similar text.",
          ),
        type: z
          .enum(["short_term", "long_term"])
          .optional()
          .describe("Filter by goal type (short_term or long_term)"),
        status: z
          .enum(["pending", "in_progress", "completed", "cancelled"])
          .optional()
          .describe("Filter by goal status"),
        limit: z
          .number()
          .optional()
          .describe("Maximum number of goals to return (default: 20)"),
      }),
    },
  );

  const getGoal = tool(
    async ({ goalId }) => {
      try {
        const goal = await db.goal.findFirst({
          where: {
            id: goalId as number,
            userId,
          },
        });

        if (!goal) {
          return `Goal with ID ${goalId} not found.`;
        }

        return JSON.stringify(
          {
            id: goal.id,
            title: goal.title,
            description: goal.description,
            type: goal.type,
            deadline: goal.deadline?.toISOString(),
            status: goal.status,
          },
          null,
          2,
        );
      } catch (error) {
        return `Error fetching goal: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "get_goal",
      description:
        "Retrieves a specific goal by its ID. Use this when the user references a goal by ID or when you need detailed information about a specific goal.",
      schema: z.object({
        goalId: z.number().describe("The ID of the goal to retrieve"),
      }),
    },
  );

  const createGoal = tool(
    async ({ title, description, type, deadline }) => {
      try {
        if (!type || !["short_term", "long_term"].includes(type as string)) {
          return "Error: Type must be 'short_term' or 'long_term'";
        }

        const goal = await db.goal.create({
          data: {
            userId,
            title: title as string,
            description: description as string | undefined,
            type: type as "short_term" | "long_term",
            deadline: deadline ? new Date(deadline as string) : null,
            status: "pending",
          },
        });

        return JSON.stringify(
          {
            id: goal.id,
            title: goal.title,
            description: goal.description,
            type: goal.type,
            deadline: goal.deadline?.toISOString(),
            status: goal.status,
            message: "Goal created successfully",
          },
          null,
          2,
        );
      } catch (error) {
        return `Error creating goal: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "create_goal",
      description:
        "Creates a new goal. Always confirm goal details with the user before creating. Requires a title and type (short_term or long_term). Optional fields include description and deadline.",
      schema: z.object({
        title: z.string().describe("Goal title (required)"),
        description: z.string().optional().describe("Goal description"),
        type: z
          .enum(["short_term", "long_term"])
          .describe("Goal type: 'short_term' or 'long_term' (required)"),
        deadline: z
          .string()
          .optional()
          .describe("Deadline in ISO 8601 format (e.g., '2024-12-31T23:59:59Z'). Optional."),
      }),
    },
  );

  const updateGoal = tool(
    async ({ goalId, title, description, type, deadline, status }) => {
      try {
        const updateData: {
          title?: string;
          description?: string | null;
          type?: string;
          deadline?: Date | null;
          status?: string;
        } = {};

        if (title !== undefined) updateData.title = title as string;
        if (description !== undefined)
          updateData.description = (description as string) || null;
        if (type !== undefined) {
          if (!["short_term", "long_term"].includes(type as string)) {
            return "Error: Type must be 'short_term' or 'long_term'";
          }
          updateData.type = type as string;
        }
        if (deadline !== undefined)
          updateData.deadline = deadline ? new Date(deadline as string) : null;
        if (status !== undefined) updateData.status = status as string;

        const result = await db.goal.updateMany({
          where: {
            id: goalId as number,
            userId,
          },
          data: updateData,
        });

        if (result.count === 0) {
          return `Goal with ID ${goalId} not found.`;
        }

        const updatedGoal = await db.goal.findUnique({
          where: { id: goalId as number },
        });

        return JSON.stringify(
          {
            id: updatedGoal!.id,
            title: updatedGoal!.title,
            description: updatedGoal!.description,
            type: updatedGoal!.type,
            deadline: updatedGoal!.deadline?.toISOString(),
            status: updatedGoal!.status,
            message: "Goal updated successfully",
          },
          null,
          2,
        );
      } catch (error) {
        return `Error updating goal: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "update_goal",
      description:
        "Updates an existing goal. Only provided fields will be updated. Always confirm what will be changed before updating. Verify the goal exists first.",
      schema: z.object({
        goalId: z.number().describe("The ID of the goal to update"),
        title: z.string().optional().describe("Goal title"),
        description: z.string().optional().describe("Goal description"),
        type: z
          .enum(["short_term", "long_term"])
          .optional()
          .describe("Goal type: 'short_term' or 'long_term'"),
        deadline: z
          .string()
          .optional()
          .describe("Deadline in ISO 8601 format. Set to empty string to remove deadline."),
        status: z
          .enum(["pending", "in_progress", "completed", "cancelled"])
          .optional()
          .describe("Goal status"),
      }),
    },
  );

  const deleteGoal = tool(
    async ({ goalId }) => {
      try {
        const result = await db.goal.deleteMany({
          where: {
            id: goalId as number,
            userId,
          },
        });

        if (result.count === 0) {
          return `Goal with ID ${goalId} not found.`;
        }

        return JSON.stringify(
          {
            message: "Goal deleted successfully",
          },
          null,
          2,
        );
      } catch (error) {
        return `Error deleting goal: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "delete_goal",
      description:
        "Permanently deletes a goal. ALWAYS confirm with the user before deleting. This action cannot be undone.",
      schema: z.object({
        goalId: z.number().describe("The ID of the goal to delete"),
      }),
    },
  );

  return [searchGoals, getGoal, createGoal, updateGoal, deleteGoal];
}

