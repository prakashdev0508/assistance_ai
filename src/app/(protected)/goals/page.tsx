"use client";

import { useState, useEffect } from "react";
import GoalModal from "~/components/goals/GoalModal";

type Goal = {
  id: number;
  title: string;
  description?: string | null;
  type: string;
  deadline?: string | null;
  status: string;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  useEffect(() => {
    void loadGoals();
  }, [searchQuery, typeFilter, statusFilter]);

  const loadGoals = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const response = await fetch(`/api/goals?${params.toString()}`);
      if (response.ok) {
        const data = (await response.json()) as { goals: Goal[] };
        setGoals(data.goals);
        setError(null);
      } else {
        setError("Failed to load goals");
      }
    } catch (err) {
      setError("Failed to load goals");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoal = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (!confirm("Are you sure you want to delete this goal?")) {
      return;
    }

    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        void loadGoals();
      } else {
        alert("Failed to delete goal");
      }
    } catch (err) {
      alert("Failed to delete goal");
      console.error(err);
    }
  };

  const handleGoalModalClose = () => {
    setIsGoalModalOpen(false);
    setEditingGoal(null);
    void loadGoals();
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "long_term":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-indigo-100 text-indigo-800";
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

  const isDeadlinePassed = (deadline?: string | null) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
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
          <h1 className="text-3xl font-semibold text-black">Goals</h1>
          <p className="text-sm text-black/60">Set and track your short-term and long-term goals</p>
        </div>
        <button
          onClick={handleCreateGoal}
          className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/90 transition-colors"
        >
          + New Goal
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search goals..."
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
        <div className="flex gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="all">All Types</option>
            <option value="short_term">Short Term</option>
            <option value="long_term">Long Term</option>
          </select>
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
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-lg font-semibold text-gray-900">No goals found</p>
          <p className="mt-2 text-sm text-gray-600">
            {searchQuery || typeFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first goal to get started"}
          </p>
          {!searchQuery && typeFilter === "all" && statusFilter === "all" && (
            <button
              onClick={handleCreateGoal}
              className="mt-6 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/90 transition-colors"
            >
              Create Goal
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="rounded-[20px] border border-white/60 bg-white/80 p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)] backdrop-blur hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.4)] transition-shadow"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-black flex-1">{goal.title}</h3>
                    <div className="flex flex-col gap-1 items-end">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeColor(goal.type)}`}
                      >
                        {goal.type === "long_term" ? "Long Term" : "Short Term"}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(goal.status)}`}
                      >
                        {goal.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="mt-2 text-sm text-black/70 line-clamp-3">{goal.description}</p>
                  )}

                  {goal.deadline && (
                    <div className="mt-4 flex items-center gap-2">
                      <svg className="h-4 w-4 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className={`text-xs ${isDeadlinePassed(goal.deadline) && goal.status !== "completed" ? "text-red-600 font-medium" : "text-black/60"}`}>
                        {isDeadlinePassed(goal.deadline) && goal.status !== "completed" ? "Overdue: " : "Deadline: "}
                        {formatDate(goal.deadline)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 pt-4 border-t border-black/5">
                  <button
                    onClick={() => handleEditGoal(goal)}
                    className="flex-1 rounded-lg bg-black/5 px-3 py-2 text-xs font-medium text-black hover:bg-black/10 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isGoalModalOpen && (
        <GoalModal
          isOpen={isGoalModalOpen}
          onClose={handleGoalModalClose}
          goal={editingGoal}
        />
      )}
    </div>
  );
}

