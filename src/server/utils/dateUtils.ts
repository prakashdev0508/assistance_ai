/**
 * Date utility functions for handling dates in India timezone (Asia/Kolkata)
 */

export function getTodayInIndia(): Date {
  // Get current date/time in India timezone
  const now = new Date();
  const indiaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );
  return indiaTime;
}

export function getTodayStartInIndia(): Date {
  const today = getTodayInIndia();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getTodayEndInIndia(): Date {
  const today = getTodayInIndia();
  today.setHours(23, 59, 59, 999);
  return today;
}

export function formatDateForCalendar(date: Date): string {
  return date.toISOString();
}

export function getTodayISOStart(): string {
  return getTodayStartInIndia().toISOString();
}

export function getTodayISOEnd(): string {
  return getTodayEndInIndia().toISOString();
}

export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export function formatTimeForDisplay(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

