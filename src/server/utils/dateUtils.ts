/**
 * Date utility functions for handling dates in India timezone (Asia/Kolkata)
 */

export function getTodayInIndia(): Date {
  // Get current date/time in India timezone
  // This returns a Date object that represents the current time in IST
  const now = new Date();
  
  // Get the current time in IST as a string
  const istString = now.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  
  // Parse the IST string to get components
  // Format: "MM/DD/YYYY, HH:MM:SS"
  const [datePart, timePart] = istString.split(", ");
  if (!datePart || !timePart) {
    throw new Error("Failed to parse IST date string");
  }
  const dateParts = datePart.split("/").map(Number);
  const timeParts = timePart.split(":").map(Number);
  
  if (dateParts.length < 3 || timeParts.length < 3) {
    throw new Error("Failed to parse IST date string components");
  }
  
  const month = dateParts[0]!;
  const day = dateParts[1]!;
  const year = dateParts[2]!;
  const hour = timeParts[0]!;
  const minute = timeParts[1]!;
  const second = timeParts[2]!;
  
  // Create a Date object in UTC that represents this IST time
  // Note: This Date object will show UTC time, but represents IST time
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
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

