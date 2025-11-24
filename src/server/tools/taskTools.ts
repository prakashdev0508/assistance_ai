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

export function createTaskTools(userId: number) {
  const searchTasks = tool(
    async ({ query, status, limit }) => {
      try {
        const searchQuery = (query as string)?.toLowerCase().trim() ?? "";
        const statusFilter = status as string | undefined;
        const limitNum = (limit as number) ?? 20;

        // Build base where clause
        const where: {
          userId: number;
          status?: string;
        } = {
          userId,
        };

        if (statusFilter) {
          where.status = statusFilter;
        }

        // Fetch all tasks (we'll do fuzzy matching in memory for better results)
        let tasks = await db.task.findMany({
          where,
          include: {
            subtasks: {
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: [
            { startDate: "asc" },
            { createdAt: "desc" },
          ],
        });

        // If there's a search query, perform fuzzy matching
        if (searchQuery) {
          const tasksWithScores = tasks.map((task) => {
            const titleScore = calculateSimilarity(searchQuery, task.title);
            const descScore = task.description
              ? calculateSimilarity(searchQuery, task.description)
              : 0;
            const subtaskScores = task.subtasks.map((st) =>
              calculateSimilarity(searchQuery, st.title),
            );
            const maxSubtaskScore = subtaskScores.length > 0
              ? Math.max(...subtaskScores)
              : 0;

            const score = Math.max(titleScore, descScore * 0.7, maxSubtaskScore * 0.6);

            return { task, score };
          });

          // Filter by minimum similarity threshold (0.3) and sort by score
          tasks = tasksWithScores
            .filter(({ score }) => score >= 0.3)
            .sort((a, b) => b.score - a.score)
            .slice(0, limitNum)
            .map(({ task }) => task);
        } else {
          tasks = tasks.slice(0, limitNum);
        }

        if (tasks.length === 0) {
          return "No tasks found matching your search.";
        }

        return JSON.stringify(
          tasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            startDate: task.startDate?.toISOString(),
            endDate: task.endDate?.toISOString(),
            status: task.status,
            priority: task.priority,
            subtasks: task.subtasks.map((st) => ({
              id: st.id,
              title: st.title,
              description: st.description,
              status: st.status,
            })),
          })),
          null,
          2,
        );
      } catch (error) {
        return `Error searching tasks: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "search_tasks",
      description:
        "Searches for tasks and subtasks using fuzzy matching. Can search by title, description, or subtask content. Returns tasks with their subtasks. Use this when the user asks about tasks, wants to find a specific task, or mentions task-related keywords. The search is intelligent and will find tasks even with partial or similar text.",
      schema: z.object({
        query: z
          .string()
          .optional()
          .describe(
            "Search query to match against task titles, descriptions, or subtasks. Can be partial or similar text.",
          ),
        status: z
          .enum(["pending", "in_progress", "completed", "cancelled"])
          .optional()
          .describe("Filter by task status"),
        limit: z
          .number()
          .optional()
          .describe("Maximum number of tasks to return (default: 20)"),
      }),
    },
  );

  const getTask = tool(
    async ({ taskId }) => {
      try {
        const task = await db.task.findFirst({
          where: {
            id: taskId as number,
            userId,
          },
          include: {
            subtasks: {
              orderBy: { createdAt: "asc" },
            },
          },
        });

        if (!task) {
          return `Task with ID ${taskId} not found.`;
        }

        return JSON.stringify(
          {
            id: task.id,
            title: task.title,
            description: task.description,
            startDate: task.startDate?.toISOString(),
            endDate: task.endDate?.toISOString(),
            status: task.status,
            priority: task.priority,
            subtasks: task.subtasks.map((st) => ({
              id: st.id,
              title: st.title,
              description: st.description,
              status: st.status,
            })),
          },
          null,
          2,
        );
      } catch (error) {
        return `Error fetching task: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "get_task",
      description:
        "Retrieves a specific task by its ID, including all subtasks. Use this when the user references a task by ID or when you need detailed information about a specific task.",
      schema: z.object({
        taskId: z.number().describe("The ID of the task to retrieve"),
      }),
    },
  );

  const createTask = tool(
    async ({ title, description, startDate, endDate, priority }) => {
      try {
        const task = await db.task.create({
          data: {
            userId,
            title: title as string,
            description: description as string | undefined,
            startDate: startDate ? new Date(startDate as string) : null,
            endDate: endDate ? new Date(endDate as string) : null,
            priority: (priority as "low" | "medium" | "high") ?? "medium",
            status: "pending",
          },
          include: {
            subtasks: true,
          },
        });

        return JSON.stringify(
          {
            id: task.id,
            title: task.title,
            description: task.description,
            startDate: task.startDate?.toISOString(),
            endDate: task.endDate?.toISOString(),
            status: task.status,
            priority: task.priority,
            message: "Task created successfully",
          },
          null,
          2,
        );
      } catch (error) {
        return `Error creating task: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "create_task",
      description:
        "Creates a new task. Always confirm task details with the user before creating. Requires a title. Optional fields include description, start date, end date, and priority.",
      schema: z.object({
        title: z.string().describe("Task title (required)"),
        description: z.string().optional().describe("Task description"),
        startDate: z
          .string()
          .optional()
          .describe("Start date in ISO 8601 format (e.g., '2024-01-15T10:00:00Z')"),
        endDate: z
          .string()
          .optional()
          .describe("End date in ISO 8601 format (e.g., '2024-01-15T11:00:00Z')"),
        priority: z
          .enum(["low", "medium", "high"])
          .optional()
          .describe("Task priority (default: medium)"),
      }),
    },
  );

  const updateTask = tool(
    async ({ taskId, title, description, startDate, endDate, status, priority }) => {
      try {
        const updateData: {
          title?: string;
          description?: string | null;
          startDate?: Date | null;
          endDate?: Date | null;
          status?: string;
          priority?: string;
        } = {};

        if (title !== undefined) updateData.title = title as string;
        if (description !== undefined)
          updateData.description = (description as string) || null;
        if (startDate !== undefined)
          updateData.startDate = startDate ? new Date(startDate as string) : null;
        if (endDate !== undefined)
          updateData.endDate = endDate ? new Date(endDate as string) : null;
        if (status !== undefined) updateData.status = status as string;
        if (priority !== undefined) updateData.priority = priority as string;

        const result = await db.task.updateMany({
          where: {
            id: taskId as number,
            userId,
          },
          data: updateData,
        });

        if (result.count === 0) {
          return `Task with ID ${taskId} not found.`;
        }

        const updatedTask = await db.task.findUnique({
          where: { id: taskId as number },
          include: {
            subtasks: {
              orderBy: { createdAt: "asc" },
            },
          },
        });

        return JSON.stringify(
          {
            id: updatedTask!.id,
            title: updatedTask!.title,
            description: updatedTask!.description,
            startDate: updatedTask!.startDate?.toISOString(),
            endDate: updatedTask!.endDate?.toISOString(),
            status: updatedTask!.status,
            priority: updatedTask!.priority,
            message: "Task updated successfully",
          },
          null,
          2,
        );
      } catch (error) {
        return `Error updating task: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "update_task",
      description:
        "Updates an existing task. Only provided fields will be updated. Always confirm what will be changed before updating. Verify the task exists first.",
      schema: z.object({
        taskId: z.number().describe("The ID of the task to update"),
        title: z.string().optional().describe("Task title"),
        description: z.string().optional().describe("Task description"),
        startDate: z
          .string()
          .optional()
          .describe("Start date in ISO 8601 format"),
        endDate: z
          .string()
          .optional()
          .describe("End date in ISO 8601 format"),
        status: z
          .enum(["pending", "in_progress", "completed", "cancelled"])
          .optional()
          .describe("Task status"),
        priority: z
          .enum(["low", "medium", "high"])
          .optional()
          .describe("Task priority"),
      }),
    },
  );

  const deleteTask = tool(
    async ({ taskId }) => {
      try {
        const result = await db.task.deleteMany({
          where: {
            id: taskId as number,
            userId,
          },
        });

        if (result.count === 0) {
          return `Task with ID ${taskId} not found.`;
        }

        return `Task ${taskId} deleted successfully.`;
      } catch (error) {
        return `Error deleting task: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "delete_task",
      description:
        "Permanently deletes a task and all its subtasks. ALWAYS confirm with the user before deleting. This action cannot be undone.",
      schema: z.object({
        taskId: z.number().describe("The ID of the task to delete"),
      }),
    },
  );

  const createSubtask = tool(
    async ({ taskId, title, description }) => {
      try {
        // Verify task belongs to user
        const task = await db.task.findFirst({
          where: {
            id: taskId as number,
            userId,
          },
        });

        if (!task) {
          return `Task with ID ${taskId} not found.`;
        }

        const subtask = await db.subTask.create({
          data: {
            taskId: taskId as number,
            title: title as string,
            description: description as string | undefined,
            status: "pending",
          },
        });

        return JSON.stringify(
          {
            id: subtask.id,
            taskId: subtask.taskId,
            title: subtask.title,
            description: subtask.description,
            status: subtask.status,
            message: "Subtask created successfully",
          },
          null,
          2,
        );
      } catch (error) {
        return `Error creating subtask: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "create_subtask",
      description:
        "Creates a new subtask for an existing task. Always confirm subtask details with the user before creating.",
      schema: z.object({
        taskId: z.number().describe("The ID of the parent task"),
        title: z.string().describe("Subtask title (required)"),
        description: z.string().optional().describe("Subtask description"),
      }),
    },
  );

  const updateSubtask = tool(
    async ({ taskId, subtaskId, title, description, status }) => {
      try {
        // Verify task belongs to user
        const task = await db.task.findFirst({
          where: {
            id: taskId as number,
            userId,
          },
        });

        if (!task) {
          return `Task with ID ${taskId} not found.`;
        }

        const updateData: {
          title?: string;
          description?: string | null;
          status?: string;
        } = {};

        if (title !== undefined) updateData.title = title as string;
        if (description !== undefined)
          updateData.description = (description as string) || null;
        if (status !== undefined) updateData.status = status as string;

        const result = await db.subTask.updateMany({
          where: {
            id: subtaskId as number,
            taskId: taskId as number,
          },
          data: updateData,
        });

        if (result.count === 0) {
          return `Subtask with ID ${subtaskId} not found in task ${taskId}.`;
        }

        const updatedSubtask = await db.subTask.findUnique({
          where: { id: subtaskId as number },
        });

        return JSON.stringify(
          {
            id: updatedSubtask!.id,
            taskId: updatedSubtask!.taskId,
            title: updatedSubtask!.title,
            description: updatedSubtask!.description,
            status: updatedSubtask!.status,
            message: "Subtask updated successfully",
          },
          null,
          2,
        );
      } catch (error) {
        return `Error updating subtask: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "update_subtask",
      description:
        "Updates an existing subtask. Only provided fields will be updated. Always confirm what will be changed before updating.",
      schema: z.object({
        taskId: z.number().describe("The ID of the parent task"),
        subtaskId: z.number().describe("The ID of the subtask to update"),
        title: z.string().optional().describe("Subtask title"),
        description: z.string().optional().describe("Subtask description"),
        status: z
          .enum(["pending", "in_progress", "completed", "cancelled"])
          .optional()
          .describe("Subtask status"),
      }),
    },
  );

  const deleteSubtask = tool(
    async ({ taskId, subtaskId }) => {
      try {
        // Verify task belongs to user
        const task = await db.task.findFirst({
          where: {
            id: taskId as number,
            userId,
          },
        });

        if (!task) {
          return `Task with ID ${taskId} not found.`;
        }

        const result = await db.subTask.deleteMany({
          where: {
            id: subtaskId as number,
            taskId: taskId as number,
          },
        });

        if (result.count === 0) {
          return `Subtask with ID ${subtaskId} not found in task ${taskId}.`;
        }

        return `Subtask ${subtaskId} deleted successfully.`;
      } catch (error) {
        return `Error deleting subtask: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    {
      name: "delete_subtask",
      description:
        "Permanently deletes a subtask. ALWAYS confirm with the user before deleting. This action cannot be undone.",
      schema: z.object({
        taskId: z.number().describe("The ID of the parent task"),
        subtaskId: z.number().describe("The ID of the subtask to delete"),
      }),
    },
  );

  return [
    searchTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    createSubtask,
    updateSubtask,
    deleteSubtask,
  ];
}

