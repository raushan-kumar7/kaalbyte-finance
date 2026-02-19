import React, { useEffect, useState, useMemo } from "react";
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
import {
  MONTH_NAMES,
  extractAvailableYears,
  generateMonthKey,
  calculateCategoryTotals,
  calculateBucketTotals,
  calculateTotalIncome,
  formatMonthRange,
} from "@/src/utils/history";

const History = () => {
  const currentDate = useMemo(() => new Date(), []);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth()); // 0-11

  // Local state — does NOT touch the shared store
  const [monthlyExpenseSummary, setMonthlyExpenseSummary] =
    useState<MonthlyExpenseTracker | null>(null);
  const [selectedMonthIncome, setSelectedMonthIncome] =
    useState<MonthlyIncome | null>(null);
  const [monthEntries, setMonthEntries] = useState<ExpenseEntry[]>([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);

  // Generate monthKey from selected month/year
  const monthKey = useMemo(() => {
    return generateMonthKey(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  // Only used to derive available years for the year selector
  const { entries } = useAllDailyEntries();
  const { incomes } = useAllMonthlyIncomes();

  // Fetch month-specific data locally — never writes to shared store
  useEffect(() => {
    let cancelled = false;
    const fetchMonthData = async () => {
      setIsLoadingLocal(true);
      try {
        const userId = getCurrentUserId();
        const [summary, income, rawEntries] = await Promise.all([
          DailyEntriesService.getMonthlyExpenseSummary(monthKey, userId),
          MonthlyIncomesService.getIncomeByMonth(monthKey, userId),
          DailyEntriesService.getEntriesByMonth(monthKey, userId),
        ]);
        if (!cancelled) {
          setMonthlyExpenseSummary(summary);
          setSelectedMonthIncome(income ?? null);

          // Map raw DB rows → ExpenseEntry[] for export
          const mapped: ExpenseEntry[] = (rawEntries ?? []).map((e) => ({
            date: new Date(e.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            category: e.category,
            description: e.description ?? "",
            amount: e.amount,
            bucket: e.bucket,
          }));
          setMonthEntries(mapped);
        }
      } catch {
        if (!cancelled) {
          setMonthlyExpenseSummary(null);
          setSelectedMonthIncome(null);
          setMonthEntries([]);
        }
      } finally {
        if (!cancelled) setIsLoadingLocal(false);
      }
    };

    fetchMonthData();
    return () => {
      cancelled = true;
    };
  }, [monthKey]);

  // Dynamically generate years based on available data
  const years = useMemo(() => {
    return extractAvailableYears(entries, incomes);
  }, [entries, incomes]);

  // Build month display data
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
        entries: monthEntries,
      };
    }

    // Fallback with empty data while loading
    return {
      month: monthName,
      month_range: monthRange,
      grandTotal: 0,
      bucketTotals: calculateBucketTotals([]),
      categoryTotals: calculateCategoryTotals([]),
      entries: [],
    };
  }, [selectedMonth, selectedYear, monthlyExpenseSummary, monthEntries]);

  // Calculate total income
  const totalIncome = useMemo(() => {
    return calculateTotalIncome(selectedMonthIncome);
  }, [selectedMonthIncome]);

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      const previousYear = selectedYear - 1;
      if (years.includes(previousYear)) {
        setSelectedYear(previousYear);
      }
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      const nextYear = selectedYear + 1;
      if (years.includes(nextYear)) {
        setSelectedYear(nextYear);
      }
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <ScreenWrapper bg="bg-brand-900">
      <View className="flex-1">
        {/* Header with Navigation */}
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

          {/* Month Navigation */}
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

            {/* Right side: Export button + Next chevron */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <ExportButton data={data} totalIncome={totalIncome} />
              <TouchableOpacity
                onPress={handleNextMonth}
                activeOpacity={0.7}
                className="w-10 h-10 rounded-full bg-white/5 items-center justify-center"
              >
                <ChevronRight size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Month Selector */}
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
                        isSelected
                          ? "text-white font-mono-bold"
                          : "text-white/60"
                      }`}
                    >
                      {item.slice(0, 3)}
                    </Typo>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* Year Selector */}
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

        {/* Monthly Expenses Tracker */}
        <Animated.View
          key={`${selectedMonth}-${selectedYear}`}
          entering={FadeIn.duration(300)}
          className="flex-1"
        >
          <MonthlyExpensesTracker
            data={data}
            totalIncome={totalIncome}
            isLoading={isLoadingLocal}
          />
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
};

export default History;