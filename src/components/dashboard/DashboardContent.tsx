"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start?: string;
  end?: string;
  location?: string;
  attendees?: string[];
}

interface Email {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  threadId: string;
}

interface DashboardData {
  today: {
    date: string;
    formatted: string;
  };
  calendar: {
    events: CalendarEvent[];
    count: number;
  };
  emails: {
    unreadImportant: Email[];
    unreadImportantCount: number;
    unansweredImportant: Email[];
    unansweredImportantCount: number;
  };
}

export default function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/dashboard/data");
      if (response.ok) {
        const dashboardData = (await response.json()) as DashboardData;
        setData(dashboardData);
      } else {
        setError("Failed to load dashboard data");
      }
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatEventTime = (start?: string, end?: string) => {
    if (!start) return "";
    try {
      const startDate = new Date(start);
      const endDate = end ? new Date(end) : null;

      const startTime = startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });

      if (endDate) {
        const endTime = endDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        });
        return `${startTime} - ${endTime}`;
      }
      return startTime;
    } catch {
      return "";
    }
  };

  const formatEmailDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));

      if (hours < 1) return "Just now";
      if (hours < 24) return `${hours}h ago`;
      if (hours < 48) return "Yesterday";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const extractName = (from: string) => {
    const regex = /^(.+?)\s*</;
    const match = regex.exec(from);
    return match?.[1]?.trim() ?? from;
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <p>{error ?? "Failed to load dashboard data"}</p>
        <button
          onClick={() => void loadDashboardData()}
          className="mt-2 text-sm underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">{data.today.formatted}</p>
        </div>
        <Link
          href="/chat"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Chat with Assistant
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Unread Important Emails */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Unread Important
              </p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {data.emails.unreadImportantCount}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Unanswered Important Emails */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Unanswered Important
              </p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {data.emails.unansweredImportantCount}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Today's Events */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Today&apos;s Events
              </p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {data.calendar.count}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Calendar Events */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Today&apos;s Schedule
              </h2>
              <Link
                href="/calendar"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {data.calendar.events.length === 0 ? (
              <div className="py-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500">No events today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.calendar.events.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border border-gray-100 bg-gray-50 p-4 transition hover:border-gray-200 hover:bg-gray-100"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {event.title}
                        </h3>
                        {event.start && (
                          <p className="mt-1 text-sm text-gray-600">
                            {formatEventTime(event.start, event.end)}
                          </p>
                        )}
                        {event.location && (
                          <p className="mt-1 text-sm text-gray-500">
                            📍 {event.location}
                          </p>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <p className="mt-1 text-xs text-gray-500">
                            👥 {event.attendees.length} attendee
                            {event.attendees.length > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Unread Important Emails */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Unread Important Emails
              </h2>
              <Link
                href="/gmail"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {data.emails.unreadImportant.length === 0 ? (
              <div className="py-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500">
                  No unread important emails
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.emails.unreadImportant.map((email) => (
                  <Link
                    key={email.id}
                    href={`https://mail.google.com/mail/u/0/#inbox/${email.threadId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-gray-100 bg-gray-50 p-4 transition hover:border-gray-200 hover:bg-gray-100"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 shrink-0 rounded-full bg-blue-600"></div>
                          <p className="truncate text-sm font-medium text-gray-900">
                            {extractName(email.from)}
                          </p>
                        </div>
                        <p className="mt-1 truncate text-sm text-gray-700">
                          {email.subject || "(No subject)"}
                        </p>
                        {email.snippet && (
                          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                            {email.snippet}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-gray-400">
                          {formatEmailDate(email.date)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unanswered Important Emails Section */}
      {data.emails.unansweredImportant.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Unanswered Important Emails
              </h2>
              <Link
                href="/gmail"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {data.emails.unansweredImportant.map((email) => (
                <Link
                  key={email.id}
                  href={`https://mail.google.com/mail/u/0/#inbox/${email.threadId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-gray-100 bg-gray-50 p-4 transition hover:border-gray-200 hover:bg-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 shrink-0 rounded-full bg-orange-600"></div>
                        <p className="truncate text-sm font-medium text-gray-900">
                          {extractName(email.from)}
                        </p>
                      </div>
                      <p className="mt-1 truncate text-sm text-gray-700">
                        {email.subject || "(No subject)"}
                      </p>
                      {email.snippet && (
                        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                          {email.snippet}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-400">
                        {formatEmailDate(email.date)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

