import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { ScreenWrapper, MonthlyExpensesTracker, Typo, ExportButton } from "@/src/components";
import { colors } from "@/src/constants/colors";
import Animated, { FadeIn } from "react-native-reanimated";
import { useAllDailyEntries, useAllMonthlyIncomes } from "@/src/hooks";
import { DailyEntriesService, MonthlyIncomesService } from "@/src/services";
import { getCurrentUserId } from "@/src/utils/auth";
import type { MonthlyExpenseTracker } from "@/src/types/finance";
import type { MonthlyIncome } from "@/src/db/schema";
import type { ExpenseEntry } from "@/src/types/export-data";
import { ExpenseRow } from "@/src/components/tables/ExpensesTable";
import {
  MONTH_NAMES,
  extractAvailableYears,
  generateMonthKey,
  calculateCategoryTotals,
  calculateBucketTotals,
  calculateTotalIncome,
  formatMonthRange,
} from "@/src/utils/history";

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Safely convert a DB date (Date object or ISO string) to "YYYY-MM-DD" */
const toISODate = (d: Date | string): string => {
  if (typeof d === "string") return d.split("T")[0];
  return d.toISOString().split("T")[0];
};

/** Shared mapping from a raw DB entry → ExpenseRow for the table */
const toExpenseRow = (e: {
  id: number;
  date: Date | string;
  category: string;
  description: string | null;
  amount: number;
  bucket: import("@/src/types/finance").BucketType;
}): ExpenseRow => ({
  id: String(e.id),
  rawDate: toISODate(e.date),
  date: new Date(e.date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
  category: e.category,
  description: e.description ?? "",
  amount: e.amount,
  bucket: e.bucket,
});

/** Shared mapping from a raw DB entry → ExpenseEntry for PDF/Excel export */
const toExportEntry = (e: {
  date: Date | string;
  category: string;
  description: string | null;
  amount: number;
  bucket: import("@/src/types/finance").BucketType;
}): ExpenseEntry => ({
  date: new Date(e.date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
  category: e.category,
  description: e.description ?? "",
  amount: e.amount,
  bucket: e.bucket,
});

// ─── Component ────────────────────────────────────────────────────────────────

const History = () => {
  const currentDate = useMemo(() => new Date(), []);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth()); // 0-11

  // ── Local state — does NOT touch the shared store ─────────────────────────
  const [monthlyExpenseSummary, setMonthlyExpenseSummary] =
    useState<MonthlyExpenseTracker | null>(null);
  const [selectedMonthIncome, setSelectedMonthIncome] =
    useState<MonthlyIncome | null>(null);
  const [monthEntries, setMonthEntries] = useState<ExpenseRow[]>([]);
  const [exportEntries, setExportEntries] = useState<ExpenseEntry[]>([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);

  // ── Month key ─────────────────────────────────────────────────────────────
  const monthKey = useMemo(
    () => generateMonthKey(selectedYear, selectedMonth),
    [selectedYear, selectedMonth],
  );

  // ── Only used to derive available years for the year selector ─────────────
  const { entries: allEntries } = useAllDailyEntries();
  const { incomes } = useAllMonthlyIncomes();

  // ── Core fetch — called on mount, on month change, and after edit/delete ──
  const fetchMonthData = useCallback(async (signal?: { cancelled: boolean }) => {
    setIsLoadingLocal(true);
    try {
      const userId = getCurrentUserId();
      const [summary, income, rawEntries] = await Promise.all([
        DailyEntriesService.getMonthlyExpenseSummary(monthKey, userId),
        MonthlyIncomesService.getIncomeByMonth(monthKey, userId),
        DailyEntriesService.getEntriesByMonth(monthKey, userId),
      ]);

      if (signal?.cancelled) return;

      setMonthlyExpenseSummary(summary);
      setSelectedMonthIncome(income ?? null);
      setMonthEntries((rawEntries ?? []).map(toExpenseRow));
      setExportEntries((rawEntries ?? []).map(toExportEntry));
    } catch {
      if (signal?.cancelled) return;
      setMonthlyExpenseSummary(null);
      setSelectedMonthIncome(null);
      setMonthEntries([]);
      setExportEntries([]);
    } finally {
      if (!signal?.cancelled) setIsLoadingLocal(false);
    }
  }, [monthKey]);

  // ── Fetch when monthKey changes ───────────────────────────────────────────
  useEffect(() => {
    const signal = { cancelled: false };
    fetchMonthData(signal);
    return () => { signal.cancelled = true; };
  }, [fetchMonthData]);

  // ── onUpdateEntry: called by ExpensesTable when user saves an edit ─────────
  const handleUpdateEntry = useCallback(
    async (id: string, updates: Partial<ExpenseRow>): Promise<boolean> => {
      try {
        const userId = getCurrentUserId();
        const numericId = Number(id);

        // Build only the fields the service needs
        const payload: Record<string, unknown> = {};
        if (updates.category !== undefined) payload.category = updates.category;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.amount !== undefined) payload.amount = updates.amount;
        if (updates.bucket !== undefined) payload.bucket = updates.bucket;

        await DailyEntriesService.updateEntry(numericId, payload, userId);

        // Silently refresh so the table shows the updated row immediately
        await fetchMonthData();
        return true;
      } catch {
        return false;
      }
    },
    [fetchMonthData],
  );

  // ── onDeleteEntry: called by ExpensesTable when user confirms delete ───────
  const handleDeleteEntry = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const userId = getCurrentUserId();
        await DailyEntriesService.deleteEntry(Number(id), userId);

        // Silently refresh so the deleted row disappears and totals update
        await fetchMonthData();
        return true;
      } catch {
        return false;
      }
    },
    [fetchMonthData],
  );

  // ── Available years ───────────────────────────────────────────────────────
  const years = useMemo(
    () => extractAvailableYears(allEntries, incomes),
    [allEntries, incomes],
  );

  // ── data for MonthlyExpensesTracker (entries as ExpenseRow[]) ─────────────
  const data = useMemo(() => {
    const monthName = MONTH_NAMES[selectedMonth];
    const monthRange = formatMonthRange(monthName, selectedYear, selectedMonth);

    if (monthlyExpenseSummary) {
      return {
        month: monthName,
        month_range: monthRange,
        grandTotal: monthlyExpenseSummary.grandTotal,
        bucketTotals: monthlyExpenseSummary.bucketTotals,
        categoryTotals: monthlyExpenseSummary.categoryTotals,
        entries: monthEntries, // ExpenseRow[] — table + edit/delete
      };
    }

    return {
      month: monthName,
      month_range: monthRange,
      grandTotal: 0,
      bucketTotals: calculateBucketTotals([]),
      categoryTotals: calculateCategoryTotals([]),
      entries: [] as ExpenseRow[],
    };
  }, [selectedMonth, selectedYear, monthlyExpenseSummary, monthEntries]);

  // ── exportData for ExportButton (entries as ExpenseEntry[], no id) ─────────
  const exportData = useMemo(
    () => ({ ...data, entries: exportEntries }),
    [data, exportEntries],
  );

  // ── Total income ──────────────────────────────────────────────────────────
  const totalIncome = useMemo(
    () => calculateTotalIncome(selectedMonthIncome),
    [selectedMonthIncome],
  );

  // ── Month navigation ──────────────────────────────────────────────────────
  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      const prev = selectedYear - 1;
      if (years.includes(prev)) setSelectedYear(prev);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      const next = selectedYear + 1;
      if (years.includes(next)) setSelectedYear(next);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ScreenWrapper bg="bg-brand-900">
      <View className="flex-1">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <View className="px-6 pt-6 pb-4 border-b border-white/5">
          <View className="mb-4">
            <Typo
              variant="muted"
              className="font-mono text-[10px] uppercase tracking-widest mb-1"
            >
              Expense History
            </Typo>
            <Typo className="text-white font-serif-bold text-2xl">
              Track Your Journey
            </Typo>
          </View>

          {/* ── Month navigation row ─────────────────────────────────────── */}
          <View className="flex-row items-center justify-between bg-brand-800 rounded-3xl p-4 border border-white/5">
            <TouchableOpacity
              onPress={handlePreviousMonth}
              activeOpacity={0.7}
              className="w-10 h-10 rounded-full bg-white/5 items-center justify-center"
            >
              <ChevronLeft size={20} color={colors.white} />
            </TouchableOpacity>

            <View className="flex-1 items-center">
              <Typo className="text-white font-sans-bold text-lg">
                {MONTH_NAMES[selectedMonth]} {selectedYear}
              </Typo>
              <Typo
                variant="muted"
                className="font-mono text-[10px] uppercase tracking-widest mt-1"
              >
                Swipe to navigate
              </Typo>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              {/* ExportButton gets ExpenseEntry[] data — no id fields */}
              <ExportButton data={exportData} totalIncome={totalIncome} />
              <TouchableOpacity
                onPress={handleNextMonth}
                activeOpacity={0.7}
                className="w-10 h-10 rounded-full bg-white/5 items-center justify-center"
              >
                <ChevronRight size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Quick month selector ─────────────────────────────────────── */}
          <View className="mt-4">
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={Array.from(MONTH_NAMES)}
              keyExtractor={(item, index) => `${item}-${index}`}
              contentContainerStyle={{ paddingHorizontal: 4 }}
              renderItem={({ item, index }) => {
                const isSelected = index === selectedMonth;
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedMonth(index)}
                    activeOpacity={0.7}
                    className={`px-4 py-2 rounded-2xl mr-2 ${
                      isSelected ? "bg-brand-500" : "bg-white/5"
                    }`}
                  >
                    <Typo
                      className={`font-mono text-xs ${
                        isSelected ? "text-white font-mono-bold" : "text-white/60"
                      }`}
                    >
                      {item.slice(0, 3)}
                    </Typo>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* ── Year selector ────────────────────────────────────────────── */}
          <View className="mt-4 flex-row items-center justify-center gap-2">
            <Typo
              variant="muted"
              className="font-mono text-[10px] uppercase tracking-widest"
            >
              Year
            </Typo>
            {years.map((year) => (
              <TouchableOpacity
                key={year}
                onPress={() => setSelectedYear(year)}
                activeOpacity={0.7}
                className={`px-3 py-1.5 rounded-xl ${
                  selectedYear === year ? "bg-gold-500" : "bg-white/5"
                }`}
              >
                <Typo
                  className={`font-mono text-xs ${
                    selectedYear === year
                      ? "text-brand-900 font-mono-bold"
                      : "text-white/60"
                  }`}
                >
                  {year}
                </Typo>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── MonthlyExpensesTracker ───────────────────────────────────────── */}
        <Animated.View
          key={`${selectedMonth}-${selectedYear}`}
          entering={FadeIn.duration(300)}
          className="flex-1"
        >
          <MonthlyExpensesTracker
            data={data}
            totalIncome={totalIncome}
            isLoading={isLoadingLocal}
            onUpdateEntry={handleUpdateEntry}
            onDeleteEntry={handleDeleteEntry}
          />
        </Animated.View>

      </View>
    </ScreenWrapper>
  );
};

export default History;