import React, { memo, useMemo, useEffect, useRef, useState } from "react";
import { View, Animated } from "react-native";
import { Typo } from "../ui";
import { calculateGrowth, getMonthDetails } from "@/src/utils/date";
import { getCurrentUserId } from "@/src/utils/auth";
import type { MonthlyExpenseTracker } from "@/src/types/finance";
import type { MonthlyIncome } from "@/src/db/schema";
import { DailyEntriesService, MonthlyIncomesService } from "@/src/services";

interface MonthData {
  summary: MonthlyExpenseTracker | null;
  income: MonthlyIncome | null;
}

const SavingsBadge = () => {
  // 1. Stable month strings — never changes during component lifetime
  const { current, previous } = useMemo(() => ({
    current: getMonthDetails(0),
    previous: getMonthDetails(-1),
  }), []);

  // 2. Local state — completely isolated from shared store
  const [currData, setCurrData] = useState<MonthData>({ summary: null, income: null });
  const [prevData, setPrevData] = useState<MonthData>({ summary: null, income: null });
  const [isLoading, setIsLoading] = useState(true);

  // 3. Fetch both months directly from service — never touches shared store
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userId = getCurrentUserId();

        const [currSummary, prevSummary, currIncome, prevIncome] = await Promise.all([
          DailyEntriesService.getMonthlyExpenseSummary(current.monthStr, userId),
          DailyEntriesService.getMonthlyExpenseSummary(previous.monthStr, userId),
          MonthlyIncomesService.getIncomeByMonth(current.monthStr, userId),
          MonthlyIncomesService.getIncomeByMonth(previous.monthStr, userId),
        ]);

        if (!cancelled) {
          setCurrData({ summary: currSummary, income: currIncome ?? null });
          setPrevData({ summary: prevSummary, income: prevIncome ?? null });
        }
      } catch (err) {
        // Silently fail — badge just won't show meaningful data
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [current.monthStr, previous.monthStr]);

  // 4. Shimmer animation
  const shimmerAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, { toValue: 0.7, duration: 800, useNativeDriver: true }),
          Animated.timing(shimmerAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      shimmerAnim.stopAnimation();
      shimmerAnim.setValue(1);
    }
  }, [isLoading, shimmerAnim]);

  // 5. Growth calculation — both months now have correct independent data
  const growthData = useMemo(() => {
    const currSurplus =
      (currData.income?.totalIncome ?? 0) - (currData.summary?.grandTotal ?? 0);
    const prevSurplus =
      (prevData.income?.totalIncome ?? 0) - (prevData.summary?.grandTotal ?? 0);

    return calculateGrowth(currSurplus, prevSurplus);
  }, [currData, prevData]);

  const { isPositive, val } = growthData;

  return (
    <Animated.View
      style={{ opacity: shimmerAnim }}
      className={`flex-row items-center mt-3 self-start px-3 py-1.5 rounded-full border ${
        isLoading
          ? "bg-white/5 border-white/10"
          : isPositive
            ? "bg-success-500/5 border-success-500/10"
            : "bg-danger-500/5 border-danger-500/10"
      }`}
    >
      <View
        className={`w-1 h-1 rounded-full mr-2 ${
          isLoading ? "bg-white/20" : isPositive ? "bg-success-500" : "bg-danger-500"
        }`}
      />
      <Typo
        className={`font-sans-semibold text-[10px] uppercase ${
          isLoading ? "text-white/20" : isPositive ? "text-success-500" : "text-danger-500"
        }`}
      >
        {isLoading ? "Calculating" : `Savings ${isPositive ? "+" : "-"}${val}%`}
      </Typo>
      <Typo className="text-gold-500 font-mono text-[9px] mx-2 uppercase">vs</Typo>
      <Typo className="text-brand-100 font-sans-medium text-[10px] uppercase">
        {previous.label}
      </Typo>
    </Animated.View>
  );
};

export default memo(SavingsBadge);