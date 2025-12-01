"use client";

import { useState, useEffect } from "react";
import JournalEntryModal from "~/components/journal/JournalEntryModal";

type JournalEntry = {
  id: number;
  date: string;
  title?: string | null;
  content: string;
  mood?: string | null;
  tags: string[];
};

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0] ?? "",
  );

  useEffect(() => {
    void loadEntries();
  }, [searchQuery, moodFilter, tagFilter]);

  const loadEntries = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (moodFilter !== "all") params.set("mood", moodFilter);
      if (tagFilter !== "all") params.set("tag", tagFilter);

      const response = await fetch(`/api/journal?${params.toString()}`);
      if (response.ok) {
        const data = (await response.json()) as { entries: JournalEntry[] };
        setEntries(data.entries);
        setError(null);
      } else {
        setError("Failed to load journal entries");
      }
    } catch (err) {
      setError("Failed to load journal entries");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEntry = () => {
    setEditingEntry(null);
    setSelectedDate(new Date().toISOString().split("T")[0] ?? "");
    setIsEntryModalOpen(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setSelectedDate(entry.date);
    setIsEntryModalOpen(true);
  };

  const handleDeleteEntry = async (entryId: number) => {
    if (!confirm("Are you sure you want to delete this journal entry?")) {
      return;
    }

    try {
      const response = await fetch(`/api/journal/${entryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        void loadEntries();
      } else {
        alert("Failed to delete entry");
      }
    } catch (err) {
      alert("Failed to delete entry");
      console.error(err);
    }
  };

  const handleEntryModalClose = () => {
    setIsEntryModalOpen(false);
    setEditingEntry(null);
    void loadEntries();
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getMoodColor = (mood?: string | null) => {
    if (!mood) return "bg-gray-100 text-gray-800";
    const moodLower = mood.toLowerCase();
    if (moodLower.includes("happy") || moodLower.includes("joy")) {
      return "bg-yellow-100 text-yellow-800";
    }
    if (moodLower.includes("grateful") || moodLower.includes("thankful")) {
      return "bg-green-100 text-green-800";
    }
    if (moodLower.includes("anxious") || moodLower.includes("worried")) {
      return "bg-red-100 text-red-800";
    }
    if (moodLower.includes("excited") || moodLower.includes("energetic")) {
      return "bg-blue-100 text-blue-800";
    }
    if (moodLower.includes("calm") || moodLower.includes("peaceful")) {
      return "bg-purple-100 text-purple-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  // Get unique moods and tags from entries
  const allMoods = Array.from(
    new Set(entries.map((e) => e.mood).filter((m): m is string => !!m)),
  );
  const allTags = Array.from(
    new Set(entries.flatMap((e) => e.tags)),
  ).sort();

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
          <h1 className="text-3xl font-semibold text-black">Journal</h1>
          <p className="text-sm text-black/60">
            Reflect on your daily experiences and thoughts
          </p>
        </div>
        <button
          onClick={handleCreateEntry}
          className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/90 transition-colors"
        >
          + New Entry
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search journal entries..."
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
            value={moodFilter}
            onChange={(e) => setMoodFilter(e.target.value)}
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="all">All Moods</option>
            {allMoods.map((mood) => (
              <option key={mood} value={mood}>
                {mood}
              </option>
            ))}
          </select>
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="all">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Entries List */}
      {entries.length === 0 ? (
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="mt-4 text-lg font-semibold text-gray-900">
            No journal entries found
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {searchQuery || moodFilter !== "all" || tagFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first journal entry to get started"}
          </p>
          {!searchQuery && moodFilter === "all" && tagFilter === "all" && (
            <button
              onClick={handleCreateEntry}
              className="mt-6 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/90 transition-colors"
            >
              Create Entry
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-[20px] border border-white/60 bg-white/80 p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)] backdrop-blur hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.4)] transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-black">
                      {formatDate(entry.date)}
                    </h3>
                    {entry.mood && (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getMoodColor(entry.mood)}`}
                      >
                        {entry.mood}
                      </span>
                    )}
                  </div>
                  {entry.title && (
                    <h4 className="text-base font-medium text-black/80 mb-2">
                      {entry.title}
                    </h4>
                  )}
                </div>
              </div>

              <p className="text-sm text-black/70 whitespace-pre-wrap mb-4">
                {entry.content}
              </p>

              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-medium text-black/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-black/5">
                <button
                  onClick={() => handleEditEntry(entry)}
                  className="flex-1 rounded-lg bg-black/5 px-3 py-2 text-xs font-medium text-black hover:bg-black/10 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isEntryModalOpen && (
        <JournalEntryModal
          isOpen={isEntryModalOpen}
          onClose={handleEntryModalClose}
          entry={editingEntry}
          defaultDate={selectedDate}
        />
      )}
    </div>
  );
}

