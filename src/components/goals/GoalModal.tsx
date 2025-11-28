"use client";

import { useState, useEffect } from "react";

type Goal = {
  id: number;
  title: string;
  description?: string | null;
  type: string;
  deadline?: string | null;
  status: string;
};

type GoalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  goal?: Goal | null;
};

export default function GoalModal({ isOpen, onClose, goal }: GoalModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"short_term" | "long_term">("short_term");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description || "");
      setType(goal.type as "short_term" | "long_term");
      setDeadline(goal.deadline && goal.deadline !== null ? new Date(goal.deadline).toISOString().split("T")[0] : "");
      setStatus(goal.status);
    } else {
      setTitle("");
      setDescription("");
      setType("short_term");
      setDeadline("");
      setStatus("pending");
    }
  }, [goal, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    setIsSubmitting(true);

    try {
      const goalData = {
        title: title.trim(),
        description: description.trim() || null,
        type,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        status,
      };

      const url = goal ? `/api/goals/${goal.id}` : "/api/goals";
      const method = goal ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goalData),
      });

      if (response.ok) {
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save goal");
      }
    } catch (err) {
      alert("Failed to save goal");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-[24px] border border-white/60 bg-white/95 p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] backdrop-blur">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-black">
            {goal ? "Edit Goal" : "Create Goal"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 text-black/60 hover:bg-black/10 transition-colors"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter goal title"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter goal description (optional)"
              rows={4}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setType("short_term")}
                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  type === "short_term"
                    ? "border-black/30 bg-black text-white"
                    : "border-black/10 bg-white text-black hover:bg-black/5"
                }`}
              >
                Short Term
              </button>
              <button
                type="button"
                onClick={() => setType("long_term")}
                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  type === "long_term"
                    ? "border-black/30 bg-black text-white"
                    : "border-black/10 bg-white text-black hover:bg-black/5"
                }`}
              >
                Long Term
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Deadline (Optional)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          {goal && (
            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : goal ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

