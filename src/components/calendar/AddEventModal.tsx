"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type AddEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get default values
  const getDefaultDate = () => new Date().toISOString().split("T")[0];
  const getDefaultTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    startDate: getDefaultDate(),
    startTime: getDefaultTime(),
    endDate: getDefaultDate(),
    endTime: getDefaultTime(),
    location: "",
    attendees: "",
    isAllDay: false,
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const today = getDefaultDate();
      const now = getDefaultTime();
      setFormData({
        summary: "",
        description: "",
        startDate: today,
        startTime: now,
        endDate: today,
        endTime: now,
        location: "",
        attendees: "",
        isAllDay: false,
      });
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate attendees
      if (!formData.attendees || formData.attendees.trim().length === 0) {
        throw new Error("At least one attendee email is required");
      }

      const attendeeEmails = formData.attendees
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      if (attendeeEmails.length === 0) {
        throw new Error("At least one valid attendee email is required");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const email of attendeeEmails) {
        if (!emailRegex.test(email)) {
          throw new Error(`Invalid email format: ${email}`);
        }
      }

      // Ensure dates are set (should always be set due to defaults, but validate anyway)
      const startDate = formData.startDate ?? getDefaultDate();
      const endDate = formData.endDate ?? formData.startDate ?? getDefaultDate();

      // Type guard: ensure dates are strings
      if (typeof startDate !== "string" || startDate.length === 0) {
        throw new Error("Start date is required");
      }
      if (typeof endDate !== "string" || endDate.length === 0) {
        throw new Error("End date is required");
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(startDate)) {
        throw new Error("Invalid start date format");
      }
      if (!dateRegex.test(endDate)) {
        throw new Error("Invalid end date format");
      }

      // Build proper ISO 8601 datetime strings
      let startDateTime: string | undefined;
      let endDateTime: string | undefined;

      if (!formData.isAllDay) {
        // Validate times are provided for timed events
        if (!formData.startTime) {
          throw new Error("Start time is required for timed events");
        }

        // Calculate default end time (1 hour after start if not provided)
        let endTime = formData.endTime;
        if (!endTime && formData.startTime) {
          const timeParts = formData.startTime.split(":");
          if (timeParts.length !== 2) {
            throw new Error("Invalid start time format");
          }
          const hours = Number.parseInt(timeParts[0] ?? "0", 10);
          const minutes = Number.parseInt(timeParts[1] ?? "0", 10);
          if (isNaN(hours) || isNaN(minutes)) {
            throw new Error("Invalid start time format");
          }
          const endHours = (hours + 1) % 24;
          endTime = `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        }

        if (!endTime) {
          throw new Error("End time is required for timed events");
        }

        // Validate time format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(formData.startTime)) {
          throw new Error("Invalid start time format. Use HH:MM format.");
        }
        if (!timeRegex.test(endTime)) {
          throw new Error("Invalid end time format. Use HH:MM format.");
        }

        // Create date objects with proper timezone handling
        // Combine date and time, then create Date object in local timezone
        const startDateStr = `${startDate}T${formData.startTime}:00`;
        const endDateStr = `${endDate}T${endTime}:00`;

        // Validate the datetime string format before creating Date object
        const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00$/;
        if (!datetimeRegex.test(startDateStr)) {
          throw new Error(`Invalid start datetime format: ${startDateStr}`);
        }
        if (!datetimeRegex.test(endDateStr)) {
          throw new Error(`Invalid end datetime format: ${endDateStr}`);
        }

        const startDateObj = new Date(startDateStr);
        const endDateObj = new Date(endDateStr);

        // Validate dates are valid
        if (isNaN(startDateObj.getTime())) {
          throw new Error(`Invalid start date/time: ${startDateStr}`);
        }
        if (isNaN(endDateObj.getTime())) {
          throw new Error(`Invalid end date/time: ${endDateStr}`);
        }

        // Ensure end is after start
        if (endDateObj <= startDateObj) {
          throw new Error("End date/time must be after start date/time");
        }

        // Convert to ISO string (this handles timezone conversion)
        startDateTime = startDateObj.toISOString();
        endDateTime = endDateObj.toISOString();
      }

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const eventData: {
        summary: string;
        description?: string;
        start: {
          dateTime?: string;
          date?: string;
          timeZone?: string;
        };
        end: {
          dateTime?: string;
          date?: string;
          timeZone?: string;
        };
        location?: string;
        attendees: Array<{ email: string }>;
      } = {
        summary: formData.summary,
        description: formData.description || undefined,
        start: formData.isAllDay
          ? { date: startDate }
          : {
              dateTime: startDateTime,
              timeZone: timeZone,
            },
        end: formData.isAllDay
          ? { date: endDate }
          : {
              dateTime: endDateTime,
              timeZone: timeZone,
            },
        location: formData.location || undefined,
        attendees: attendeeEmails.map((email) => ({ email })),
      };

      const response = await fetch("/api/integrations/google/calendar/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string };
        const errorMessage = errorData.error ?? `Failed to create event: ${response.statusText}`;
        console.error("[calendar] Event creation error:", errorData);
        throw new Error(errorMessage);
      }

      // Close modal (form will reset when modal reopens)
      onClose();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create event. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[28px] border border-white/60 bg-white/95 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="shrink-0 px-6 pt-6 pb-4 border-b border-black/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black">Add New Event</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-black/60 hover:bg-black/10 hover:text-black transition-colors"
              aria-label="Close modal"
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
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} id="event-form" className="space-y-3">
          {/* Title */}
          <div>
            <label
              htmlFor="summary"
              className="mb-1 block text-sm font-medium text-black"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="summary"
              name="summary"
              required
              value={formData.summary}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
              placeholder="Event title"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-black"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
              placeholder="Add event description"
            />
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAllDay"
              name="isAllDay"
              checked={formData.isAllDay}
              onChange={handleChange}
              className="h-4 w-4 rounded border-black/20 text-black focus:ring-2 focus:ring-black/20"
            />
            <label
              htmlFor="isAllDay"
              className="text-sm font-medium text-black cursor-pointer"
            >
              All day event
            </label>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="mb-1 block text-sm font-medium text-black"
              >
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            {/* Start Time */}
            {!formData.isAllDay && (
              <div>
                <label
                  htmlFor="startTime"
                  className="mb-1 block text-sm font-medium text-black"
                >
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  required={!formData.isAllDay}
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
            )}

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="mb-1 block text-sm font-medium text-black"
              >
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            {/* End Time */}
            {!formData.isAllDay && (
              <div>
                <label
                  htmlFor="endTime"
                  className="mb-1 block text-sm font-medium text-black"
                >
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  required={!formData.isAllDay}
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="mb-1 block text-sm font-medium text-black"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
              placeholder="Event location"
            />
          </div>

          {/* Attendees */}
          <div>
            <label
              htmlFor="attendees"
              className="mb-1 block text-sm font-medium text-black"
            >
              Attendees <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="attendees"
              name="attendees"
              required
              value={formData.attendees}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
              placeholder="email1@example.com, email2@example.com"
            />
            <p className="mt-1 text-xs text-black/50">
              Separate multiple emails with commas (at least one required)
            </p>
          </div>
        </form>
        </div>

        {/* Fixed Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-black/5 bg-white/95">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-black/10 bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-black/5 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="event-form"
              disabled={isSubmitting}
              className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

