import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { colors } from "@/src/constants/colors";
import { Typo } from "../ui";
import { DailyEntriesService, MonthlyIncomesService } from "@/src/services";
import { getCurrentUserId } from "@/src/utils/auth";
import { getLastMonths } from "@/src/utils/date";

const MonthlyGrowthTrend = () => {
  const [stackData, setStackData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLast4Months = async () => {
      setLoading(true);
      const userId = getCurrentUserId();
      const targetMonths = getLastMonths(4);

      try {
        const fetchPromises = targetMonths.map(async ({ monthStr, label }) => {
          try {
            const [summary, income] = await Promise.all([
              DailyEntriesService.getMonthlyExpenseSummary(monthStr, userId),
              MonthlyIncomesService.getIncomeByMonth(monthStr, userId),
            ]);

            const totalIncome = income?.totalIncome ?? 0;
            const needs = summary?.bucketTotals?.needs ?? 0;
            const wants = summary?.bucketTotals?.wants ?? 0;
            const savings = summary?.bucketTotals?.savings ?? 0;

            const totalExpenses = needs + wants + savings;
            const surplus = Math.max(0, totalIncome - totalExpenses);

            return {
              stacks: [
                { value: totalExpenses, color: colors.brand[500] },
                { value: surplus, color: colors.success[500] },
              ],
              label: label,
              totalIncome: totalIncome,
            };
          } catch (err) {
            console.error("Error: ", err);
            return {
              stacks: [
                { value: 0, color: colors.brand[500] },
                { value: 0, color: colors.success[500] },
              ],
              label: label,
            };
          }
        });

        const results = await Promise.all(fetchPromises);
        setStackData(results);
      } catch (error) {
        console.error("Critical Trend Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLast4Months();
  }, []);

  if (loading) {
    return (
      <View className="bg-brand-800 rounded-[32px] p-12 items-center justify-center border border-white/5">
        <ActivityIndicator color={colors.gold[500]} />
      </View>
    );
  }

  return (
    <View
      className="bg-brand-800 rounded-[32px] p-6 border border-white/5"
      style={{ overflow: "visible" }}
    >
      <View className="mb-6 flex-row justify-between items-center">
        <Typo
          variant="muted"
          className="font-mono text-[10px] uppercase tracking-widest"
        >
          Surplus Trend
        </Typo>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-brand-500 mr-1" />
          <Typo className="text-[8px] text-white/50 mr-3">EXPENSES</Typo>
          <View className="w-2 h-2 rounded-full bg-success-500 mr-1" />
          <Typo className="text-[8px] text-white/50">SURPLUS</Typo>
        </View>
      </View>

      <View style={{ overflow: "visible" }}>
        <BarChart
          stackData={stackData}
          barWidth={25}
          spacing={30}
          noOfSections={4}
          barBorderRadius={4}
          yAxisThickness={0}
          xAxisThickness={0}
          hideRules
          height={180}
          focusBarOnPress
          renderTooltip={(item: any) => {
            const expense = item.stacks[0].value;
            const surplus = item.stacks[1].value;
            const income = item.totalIncome ?? expense + surplus;
            return (
              <View
                className="p-2 rounded-xl border border-white/10 mb-[-100px] right-14 items-center shadow-lg"
                style={{ backgroundColor: colors.ui.card }}
              >
                <Typo className="text-gold-500 text-[10px] font-mono-bold">
                  ₹{(income / 1000).toFixed(1)}k Income
                </Typo>
                <Typo className="text-brand-500 text-[10px] font-mono-bold">
                  ₹{(expense / 1000).toFixed(1)}k Expenses
                </Typo>
                <Typo className="text-success-500 text-[10px] font-mono-bold">
                  +₹{(surplus / 1000).toFixed(1)}k Surplus
                </Typo>
              </View>
            );
          }}
          yAxisTextStyle={{ color: colors.text.muted, fontSize: 9 }}
          xAxisLabelTextStyle={{
            color: colors.text.muted,
            fontSize: 10,
            fontFamily: "FiraCode-Regular",
          }}
        />
      </View>
    </View>
  );
};

export default MonthlyGrowthTrend;
