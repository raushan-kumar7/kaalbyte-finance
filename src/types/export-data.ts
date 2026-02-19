import { BucketType } from "./finance";

export interface ExpenseEntry {
  date: string; // e.g. "2026-02-19" or "19 Feb"
  category: string;
  description: string;
  amount: number;
  bucket: BucketType;
}

export interface ExportData {
  month: string;
  month_range: string;
  grandTotal: number;
  totalIncome: number;
  bucketTotals: Record<BucketType, number>;
  categoryTotals: Record<string, number>;
  entries: ExpenseEntry[]; // ← individual daily expense rows
}
