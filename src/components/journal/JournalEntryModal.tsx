"use client";

import { useState, useEffect } from "react";

type JournalEntry = {
  id: number;
  date: string;
  title?: string | null;
  content: string;
  mood?: string | null;
  tags: string[];
};

type JournalEntryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  entry?: JournalEntry | null;
  defaultDate?: string;
};

const MOOD_OPTIONS = [
  "happy",
  "grateful",
  "excited",
  "calm",
  "anxious",
  "sad",
  "tired",
  "energetic",
  "peaceful",
  "worried",
  "content",
  "frustrated",
];

export default function JournalEntryModal({
  isOpen,
  onClose,
  entry,
  defaultDate,
}: JournalEntryModalProps) {
  const [date, setDate] = useState(
    defaultDate ?? new Date().toISOString().split("T")[0] ?? "",
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (entry) {
      setDate(entry.date);
      setTitle(entry.title ?? "");
      setContent(entry.content);
      setMood(entry.mood ?? "");
      setTagsInput(entry.tags.join(", "));
    } else {
      setDate(defaultDate ?? new Date().toISOString().split("T")[0] ?? "");
      setTitle("");
      setContent("");
      setMood("");
      setTagsInput("");
    }
  }, [entry, defaultDate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Please enter journal content");
      return;
    }

    setIsSubmitting(true);

    try {
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const entryData = {
        date: new Date(date).toISOString().split("T")[0],
        title: title.trim() || null,
        content: content.trim(),
        mood: mood.trim() || null,
        tags,
      };

      const url = entry ? `/api/journal/${entry.id}` : "/api/journal";
      const method = entry ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entryData),
      });

      if (response.ok) {
        onClose();
      } else {
        const error = (await response.json()) as { error?: string };
        alert(error.error ?? "Failed to save journal entry");
      }
    } catch (err) {
      alert("Failed to save journal entry");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-[24px] border border-white/60 bg-white/95 p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] backdrop-blur max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-black">
            {entry ? "Edit Journal Entry" : "Create Journal Entry"}
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
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter entry title (optional)"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts, experiences, and reflections..."
              rows={10}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Mood (Optional)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {MOOD_OPTIONS.map((moodOption) => (
                <button
                  key={moodOption}
                  type="button"
                  onClick={() => setMood(mood === moodOption ? "" : moodOption)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                    mood === moodOption
                      ? "border-black/30 bg-black text-white"
                      : "border-black/10 bg-white text-black hover:bg-black/5"
                  }`}
                >
                  {moodOption}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Or type your mood"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Tags (Optional)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Enter tags separated by commas (e.g., work, personal, reflection)"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            <p className="mt-1 text-xs text-black/50">
              Separate multiple tags with commas
            </p>
          </div>

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
              {isSubmitting ? "Saving..." : entry ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

