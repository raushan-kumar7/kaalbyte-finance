import { BucketType } from "@/src/types/finance";
import type { DailyEntry } from "@/src/db/schema";

/**
 * Generates a month key in YYYY-MM format
 */
export const generateMonthKey = (year: number, month: number): string => {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
};

/**
 * Extracts available years from daily entries and monthly incomes
 */
export const extractAvailableYears = (
  entries: { date: Date | string }[],
  incomes: { month: string }[],
): number[] => {
  const yearsSet = new Set<number>();

  // Get years from daily entries
  entries.forEach((entry) => {
    const year = new Date(entry.date).getFullYear();
    if (!isNaN(year)) {
      yearsSet.add(year);
    }
  });

  // Get years from monthly incomes
  incomes.forEach((income) => {
    const year = parseInt(income.month.split("-")[0]);
    if (!isNaN(year)) {
      yearsSet.add(year);
    }
  });

  // If no data, return current year
  if (yearsSet.size === 0) {
    yearsSet.add(new Date().getFullYear());
  }

  // Convert to sorted array
  return Array.from(yearsSet).sort((a, b) => a - b);
};

/**
 * Calculates category totals from daily entries
 */
export const calculateCategoryTotals = (
  entries: DailyEntry[],
): Record<string, number> => {
  return entries.reduce(
    (acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + entry.amount;
      return acc;
    },
    {} as Record<string, number>,
  );
};

/**
 * Calculates bucket totals from daily entries
 */
export const calculateBucketTotals = (
  entries: DailyEntry[],
): Record<BucketType, number> => {
  return entries.reduce(
    (acc, entry) => {
      acc[entry.bucket] = (acc[entry.bucket] || 0) + entry.amount;
      return acc;
    },
    {
      [BucketType.NEEDS]: 0,
      [BucketType.WANTS]: 0,
      [BucketType.SAVINGS]: 0,
    } as Record<BucketType, number>,
  );
};

/**
 * Calculates grand total from daily entries
 */
export const calculateGrandTotal = (entries: DailyEntry[]): number => {
  return entries.reduce((sum, entry) => sum + entry.amount, 0);
};

/**
 * Calculates total income from monthly income object
 */
export const calculateTotalIncome = (
  income: {
    salary?: number;
    otherIncome?: number;
    other_income?: number;
  } | null,
): number => {
  if (!income) return 0;
  return (
    (income.salary || 0) + (income.otherIncome || income.other_income || 0)
  );
};

/**
 * Formats month range string
 */
export const formatMonthRange = (
  monthName: string,
  year: number,
  month: number,
): string => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return `01 ${monthName.slice(0, 3)} - ${daysInMonth} ${monthName.slice(0, 3)}`;
};

/**
 * Calculates financial surplus/deficit
 */
export const calculateSurplus = (
  totalIncome: number,
  totalExpenses: number,
) => {
  const surplus = totalIncome - totalExpenses;
  const surplusPercentage = totalIncome > 0 ? (surplus / totalIncome) * 100 : 0;
  const isOverBudget = surplus < 0;

  return {
    surplus,
    surplusPercentage,
    isOverBudget,
  };
};

/**
 * Calculates bucket percentage relative to total income
 */
export const calculateBucketPercentage = (
  bucketAmount: number,
  totalIncome: number,
): string => {
  return totalIncome > 0
    ? ((bucketAmount / totalIncome) * 100).toFixed(1)
    : "0.0";
};

/**
 * Calculates expense percentage relative to total income
 */
export const calculateExpensePercentage = (
  totalExpenses: number,
  totalIncome: number,
): string => {
  return totalIncome > 0
    ? ((totalExpenses / totalIncome) * 100).toFixed(1)
    : "0.0";
};

/**
 * Month names array
 */
export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/**
 * Month abbreviations
 */
export const MONTH_ABBREVIATIONS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;
