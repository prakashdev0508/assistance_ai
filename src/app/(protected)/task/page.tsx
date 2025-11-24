"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TaskModal from "~/components/task/TaskModal";
import SubtaskModal from "~/components/task/SubtaskModal";

type Task = {
  id: number;
  title: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
  priority: string;
  subtasks: SubTask[];
};

type SubTask = {
  id: number;
  title: string;
  description?: string | null;
  status: string;
};

export default function TaskPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editingSubtask, setEditingSubtask] = useState<SubTask | null>(null);

  useEffect(() => {
    void loadTasks();
  }, [searchQuery, statusFilter]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const response = await fetch(`/api/tasks?${params.toString()}`);
      if (response.ok) {
        const data = (await response.json()) as { tasks: Task[] };
        setTasks(data.tasks);
        setError(null);
      } else {
        setError("Failed to load tasks");
      }
    } catch (err) {
      setError("Failed to load tasks");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task? This will also delete all subtasks.")) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        void loadTasks();
      } else {
        alert("Failed to delete task");
      }
    } catch (err) {
      alert("Failed to delete task");
      console.error(err);
    }
  };

  const handleCreateSubtask = (taskId: number) => {
    setSelectedTaskId(taskId);
    setEditingSubtask(null);
    setIsSubtaskModalOpen(true);
  };

  const handleEditSubtask = (taskId: number, subtask: SubTask) => {
    setSelectedTaskId(taskId);
    setEditingSubtask(subtask);
    setIsSubtaskModalOpen(true);
  };

  const handleDeleteSubtask = async (taskId: number, subtaskId: number) => {
    if (!confirm("Are you sure you want to delete this subtask?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        void loadTasks();
      } else {
        alert("Failed to delete subtask");
      }
    } catch (err) {
      alert("Failed to delete subtask");
      console.error(err);
    }
  };

  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    void loadTasks();
  };

  const handleSubtaskModalClose = () => {
    setIsSubtaskModalOpen(false);
    setSelectedTaskId(null);
    setEditingSubtask(null);
    void loadTasks();
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-black">Tasks</h1>
          <p className="text-sm text-black/60">Manage your tasks and goals</p>
        </div>
        <button
          onClick={handleCreateTask}
          className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/90 transition-colors"
        >
          + New Task
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="w-full rounded-xl border border-black/10 bg-white px-4 pr-12 py-2.5 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white hover:bg-black/90 transition-colors"
            aria-label="Search"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="rounded-[28px] border border-white/60 bg-white/80 p-12 text-center shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] backdrop-blur">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="mt-4 text-lg font-semibold text-gray-900">No tasks found</p>
          <p className="mt-2 text-sm text-gray-600">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first task to get started"}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <button
              onClick={handleCreateTask}
              className="mt-6 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/90 transition-colors"
            >
              Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-[20px] border border-white/60 bg-white/80 p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)] backdrop-blur"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-black">{task.title}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(task.status)}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <p className="mt-2 text-sm text-black/70">{task.description}</p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-black/60">
                    {task.startDate && (
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Start: {formatDate(task.startDate)}</span>
                      </div>
                    )}
                    {task.endDate && (
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>End: {formatDate(task.endDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Subtasks */}
                  {task.subtasks.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-medium text-black/60">Subtasks:</p>
                      {task.subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="flex items-center justify-between rounded-lg border border-black/5 bg-black/2 p-3"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="checkbox"
                              checked={subtask.status === "completed"}
                              onChange={async () => {
                                const newStatus =
                                  subtask.status === "completed" ? "pending" : "completed";
                                try {
                                  await fetch(`/api/tasks/${task.id}/subtasks/${subtask.id}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ status: newStatus }),
                                  });
                                  void loadTasks();
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              className="h-4 w-4 rounded border-black/20 text-black focus:ring-2 focus:ring-black/20"
                            />
                            <span
                              className={`flex-1 text-sm ${
                                subtask.status === "completed"
                                  ? "line-through text-black/50"
                                  : "text-black"
                              }`}
                            >
                              {subtask.title}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(subtask.status)}`}
                            >
                              {subtask.status.replace("_", " ")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <button
                              onClick={() => handleEditSubtask(task.id, subtask)}
                              className="rounded-lg bg-black/5 px-2 py-1 text-xs font-medium text-black hover:bg-black/10 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSubtask(task.id, subtask.id)}
                              className="rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => handleCreateSubtask(task.id)}
                      className="rounded-lg bg-black/5 px-3 py-1.5 text-xs font-medium text-black hover:bg-black/10 transition-colors"
                    >
                      + Add Subtask
                    </button>
                    <button
                      onClick={() => handleEditTask(task)}
                      className="rounded-lg bg-black/5 px-3 py-1.5 text-xs font-medium text-black hover:bg-black/10 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={handleTaskModalClose}
          task={editingTask}
        />
      )}

      {isSubtaskModalOpen && selectedTaskId && (
        <SubtaskModal
          isOpen={isSubtaskModalOpen}
          onClose={handleSubtaskModalClose}
          taskId={selectedTaskId}
          subtask={editingSubtask}
        />
      )}
    </div>
  );
}
