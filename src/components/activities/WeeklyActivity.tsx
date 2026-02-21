import React from "react";
import { View, ActivityIndicator } from "react-native";
import { colors } from "@/src/constants/colors";
import { TrendingDown, TrendingUp } from "lucide-react-native";
import { WeeklyBarChart } from "../charts";
import { Typo } from "../ui";
import { useCurrentMonthEntries } from "@/src/hooks";

const WeeklyActivity = () => {
  const { entries, isLoading, error } = useCurrentMonthEntries();
  
  const weeklyData = React.useMemo(() => {
    const today = new Date();
    const weekDays: { date: Date; total: number }[] = [];
    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      weekDays.push({
        date,
        total: 0,
      });
    }
    // Sum up entries for each day
    entries.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const dayIndex = weekDays.findIndex(
        (day) =>
          day.date.toDateString() === entryDate.toDateString()
      );
      if (dayIndex !== -1) {
        weekDays[dayIndex].total += entry.amount;
      }
    });
    return weekDays;
  }, [entries]);
  // Calculate week totals for comparison
  const currentWeekTotal = weeklyData.reduce((sum, day) => sum + day.total, 0);
  
  // Calculate previous week total
  const previousWeekTotal = React.useMemo(() => {
    const today = new Date();
    let total = 0;
    entries.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const daysAgo = Math.floor(
        (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      // Previous week: 7-13 days ago
      if (daysAgo >= 7 && daysAgo <= 13) {
        total += entry.amount;
      }
    });
    return total;
  }, [entries]);
  const percentChange = previousWeekTotal > 0
    ? ((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100
    : 0;
  const isIncrease = percentChange > 0;
  const absPercentChange = Math.abs(percentChange);
  if (isLoading) {
    return (
      <View className="items-center justify-center py-10">
        <ActivityIndicator size="large" color={colors.gold[500]} />
        <Typo className="text-text-muted mt-4 font-mono text-xs">
          Loading weekly data...
        </Typo>
      </View>
    );
  }
  if (error) {
    return (
      <View className="items-center justify-center py-10">
        <Typo className="text-danger-500 font-mono text-xs">{error}</Typo>
      </View>
    );
  }
  return (
    <View className="gap-y-6">
      <WeeklyBarChart weeklyData={weeklyData} />
      
      <View
        className={`rounded-[24px] p-5 border flex-row items-center ${
          isIncrease
            ? "bg-danger-500/5 border-danger-500/10"
            : "bg-success-500/5 border-success-500/10"
        }`}
      >
        <View
          className={`p-3 rounded-2xl mr-4 ${
            isIncrease ? "bg-danger-500/20" : "bg-success-500/20"
          }`}
        >
          {isIncrease ? (
            <TrendingUp size={20} color={colors.danger[500]} />
          ) : (
            <TrendingDown size={20} color={colors.success[500]} />
          )}
        </View>
        <View className="flex-1">
          <Typo className="text-white font-sans-medium leading-5">
            Your spending is{" "}
            <Typo
              className={isIncrease ? "text-danger-500" : "text-success-500"}
            >
              {absPercentChange.toFixed(1)}% {isIncrease ? "higher" : "lower"}
            </Typo>{" "}
            than last week.{" "}
            {!isIncrease && "Keep it up!"}
          </Typo>
        </View>
      </View>
    </View>
  );
};
export default WeeklyActivity;