import { BucketType } from "./finance";

export interface ExpenseEntry {
  date: string;
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
  entries: ExpenseEntry[];
}
