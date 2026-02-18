import { BucketType } from "./finance";

export interface ExportData {
  month: string;
  month_range: string;
  grandTotal: number;
  totalIncome: number;
  bucketTotals: Record<BucketType, number>;
  categoryTotals: Record<string, number>;
}
