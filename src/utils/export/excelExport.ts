import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as XLSX from "xlsx";
import { BucketType } from "@/src/types/finance";
import { ExportData } from "@/src/types/export-data";

// ─────────────────────────────────────────────────────────────────────────────
// Excel Export — two-sheet workbook: Summary + Categories
// ─────────────────────────────────────────────────────────────────────────────

export const exportToExcel = async (data: ExportData): Promise<void> => {
  const surplus = data.totalIncome - data.grandTotal;
  const todayStr = new Date().toLocaleDateString("en-IN");

  // ── Helper to compute bucket stats ────────────────────────────────────────
  const bucketPctIncome = (key: BucketType) =>
    data.totalIncome > 0
      ? `${(((data.bucketTotals[key] ?? 0) / data.totalIncome) * 100).toFixed(1)}%`
      : "—";

  const bucketPctSpend = (key: BucketType) =>
    data.grandTotal > 0
      ? `${(((data.bucketTotals[key] ?? 0) / data.grandTotal) * 100).toFixed(1)}%`
      : "—";

  const bucketVariance = (key: BucketType, ideal: number) =>
    data.totalIncome > 0
      ? `${((((data.bucketTotals[key] ?? 0) / data.totalIncome) * 100) - ideal).toFixed(1)}%`
      : "—";

  // ── Sheet 1: Summary ──────────────────────────────────────────────────────
  const summaryAOA = [
    ["KAALBYTE FINANCE — EXPENSE STATEMENT"],
    [],
    ["Period",    data.month_range],
    ["Month",     data.month],
    ["Generated", todayStr],
    [],
    ["FINANCIAL SUMMARY"],
    ["", "Amount (₹)"],
    ["Total Income",                      data.totalIncome],
    ["Total Expenses",                    data.grandTotal],
    [surplus >= 0 ? "Surplus" : "Deficit", Math.abs(surplus)],
    ["Utilization %", data.totalIncome > 0
      ? `${((data.grandTotal / data.totalIncome) * 100).toFixed(1)}%`
      : "—"],
    [],
    ["BUDGET ALLOCATION (50/30/20 Rule)"],
    ["Bucket", "Amount (₹)", "% of Income", "% of Spend", "Ideal %", "Variance"],
    ["Needs",   data.bucketTotals[BucketType.NEEDS]   ?? 0, bucketPctIncome(BucketType.NEEDS),   bucketPctSpend(BucketType.NEEDS),   "50%", bucketVariance(BucketType.NEEDS, 50)],
    ["Wants",   data.bucketTotals[BucketType.WANTS]   ?? 0, bucketPctIncome(BucketType.WANTS),   bucketPctSpend(BucketType.WANTS),   "30%", bucketVariance(BucketType.WANTS, 30)],
    ["Savings", data.bucketTotals[BucketType.SAVINGS] ?? 0, bucketPctIncome(BucketType.SAVINGS), bucketPctSpend(BucketType.SAVINGS), "20%", bucketVariance(BucketType.SAVINGS, 20)],
  ];

  // ── Sheet 2: Categories ───────────────────────────────────────────────────
  const categoryDataRows = Object.entries(data.categoryTotals)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, amount], i) => [
      i + 1,
      cat,
      amount,
      data.totalIncome > 0 ? `${((amount / data.totalIncome) * 100).toFixed(1)}%` : "—",
      data.grandTotal  > 0 ? `${((amount / data.grandTotal)  * 100).toFixed(1)}%` : "—",
    ]);

  const categoriesAOA = [
    ["KAALBYTE FINANCE — CATEGORY BREAKDOWN"],
    [`${data.month} · ${data.month_range}`],
    [],
    ["#", "Category", "Amount (₹)", "% of Income", "% of Total Spend"],
    ...categoryDataRows,
    [],
    ["", "GRAND TOTAL", data.grandTotal, "", "100%"],
  ];

  // ── Build workbook ────────────────────────────────────────────────────────
  const wb = XLSX.utils.book_new();

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryAOA);
  summarySheet["!cols"] = [{ wch: 28 }, { wch: 18 }, { wch: 16 }, { wch: 14 }, { wch: 10 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  const categorySheet = XLSX.utils.aoa_to_sheet(categoriesAOA);
  categorySheet["!cols"] = [{ wch: 6 }, { wch: 30 }, { wch: 18 }, { wch: 16 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, categorySheet, "Categories");

  // ── Write & share ─────────────────────────────────────────────────────────
  const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
  const dest = `${FileSystem.documentDirectory}${data.month.replace(/ /g, "_")}_statement.xlsx`;

  await FileSystem.writeAsStringAsync(dest, wbout, {
    encoding: FileSystem.EncodingType.Base64,
  });

  await Sharing.shareAsync(dest, {
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    UTI: "com.microsoft.excel.xlsx",
    dialogTitle: `${data.month} Expense Statement`,
  });
};