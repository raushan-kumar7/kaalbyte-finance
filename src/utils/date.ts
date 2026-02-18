import { formatDistanceToNow } from "date-fns";

/**
 * Returns the month string (YYYY-MM) and label for the current month and its relative offset
 * @param offset - Number of months to shift (0 for current, -1 for previous)
 */
export const getMonthDetails = (offset: number = 0) => {
  const date = new Date();
  // Set to day 1 to avoid month-skipping bugs (e.g., being on Jan 31st and subtracting 1 month)
  date.setDate(1);
  date.setMonth(date.getMonth() + offset);

  const year = date.getFullYear();
  const monthNum = String(date.getMonth() + 1).padStart(2, "0");

  return {
    monthStr: `${year}-${monthNum}`, // "2026-02"
    label: date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }), // "Feb 2026"
    monthName: date.toLocaleDateString("en-US", { month: "short" }), // "Feb"
  };
};

/**
 * Calculates growth percentage between two values
 * @returns { val: number, isPositive: boolean }
 */
export const calculateGrowth = (current: number, previous: number) => {
  if (previous <= 0) return { val: 0, isPositive: current >= 0 };

  const growth = ((current - previous) / previous) * 100;
  return {
    val: Math.abs(Math.round(growth)),
    isPositive: growth >= 0,
  };
};

/**
 * Returns the current month in YYYY-MM format (e.g., "2026-02")
 */
export const getCurrentMonthStr = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

/**
 * Converts an ISO date string to a human-readable "time ago" format
 */
export const formatTimeAgo = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
    if (diffInHours < 24)
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    if (diffInDays < 7)
      return diffInDays === 1 ? "Yesterday" : `${diffInDays} days ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch (error) {
    console.error("Error formatting time ago:", error);
    return "Unknown";
  }
};

/**
 * Formats a YYYY-MM string into a readable Full Month Year
 * Example: "2026-01" -> "January 2026"
 */
export const formatMonthDisplay = (monthStr: string): string => {
  if (!monthStr) return "";
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

/**
 * Generates an array of the last N months.
 */
export const getLastMonths = (count: number = 4) => {
  const months = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const label = targetDate.toLocaleDateString("en-US", { month: "short" });

    months.push({
      monthStr: `${year}-${month}`,
      label: label,
    });
  }
  return months;
};

// export const getTimeAgo = (dateString: string | undefined) => {
//   if (!dateString) return "Never updated";
//   return `Last changed ${formatDistanceToNow(new Date(dateString), { addSuffix: true })}`;
// };

export const getTimeAgo = (date: any) => {
  if (!date) return "Never updated";

  try {
    let parsedDate: Date;

    // 1. Handle Firestore Timestamp objects (.toDate() method)
    if (date && typeof date.toDate === "function") {
      parsedDate = date.toDate();
    }
    // 2. Handle ISO strings or existing Date objects
    else {
      parsedDate = new Date(date);
    }

    // Check if the resulting date is actually valid
    if (isNaN(parsedDate.getTime())) {
      return "Recently updated";
    }

    return `Last changed ${formatDistanceToNow(parsedDate, { addSuffix: true })}`;
  } catch {
    return "Recently updated";
  }
};
