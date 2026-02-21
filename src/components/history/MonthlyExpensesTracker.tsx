import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  TrendingDown,
  TrendingUp,
  Wallet,
  LayoutList,
  PieChart,
  Receipt,
} from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { BucketType } from "@/src/types/finance";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Typo } from "../ui";
import { CategoryBreakdownTable, ExpensesTable } from "../tables";
import { ExpenseRow } from "../tables/ExpensesTable";

export interface MonthlyExpensesTrackerProps {
  data: {
    month: string;
    month_range: string;
    categoryTotals: Record<string, number>;
    bucketTotals: {
      [K in BucketType]: number;
    };
    grandTotal: number;
    entries?: ExpenseRow[];
  };
  totalIncome?: number;
  isLoading?: boolean;
  onUpdateEntry?: (
    id: string,
    updates: Partial<ExpenseRow>,
  ) => Promise<boolean>;
  onDeleteEntry?: (id: string) => Promise<boolean>;
}

type TabId = "summary" | "categories" | "entries";

const TABS: { id: TabId; label: string; icon: typeof LayoutList }[] = [
  { id: "summary", label: "Summary", icon: PieChart },
  { id: "categories", label: "Categories", icon: LayoutList },
  { id: "entries", label: "Entries", icon: Receipt },
];

const bucketConfig = [
  {
    type: BucketType.NEEDS,
    label: "Needs",
    color: colors.success[500],
    bgColor: `${colors.success[500]}15`,
    icon: Wallet,
    ideal: 50,
  },
  {
    type: BucketType.WANTS,
    label: "Wants",
    color: colors.danger[500],
    bgColor: `${colors.danger[500]}15`,
    icon: TrendingUp,
    ideal: 30,
  },
  {
    type: BucketType.SAVINGS,
    label: "Savings",
    color: colors.gold[500],
    bgColor: `${colors.gold[500]}15`,
    icon: TrendingDown,
    ideal: 20,
  },
];

const MonthlyExpensesTracker = ({
  data,
  totalIncome = 0,
  isLoading = false,
  onUpdateEntry,
  onDeleteEntry,
}: MonthlyExpensesTrackerProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("summary");

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.gold[500]} />
        <Typo
          variant="muted"
          className="font-mono text-xs mt-4 uppercase tracking-widest"
        >
          Loading...
        </Typo>
      </View>
    );
  }

  const surplus = totalIncome - data.grandTotal;
  const surplusPercentage = totalIncome > 0 ? (surplus / totalIncome) * 100 : 0;
  const isOverBudget = surplus < 0;

  const getBucketPercentage = (bucket: BucketType) =>
    totalIncome > 0
      ? ((data.bucketTotals[bucket] / totalIncome) * 100).toFixed(1)
      : "0.0";

  // Build entry counts per category from entries array
  const entryCounts = (data.entries ?? []).reduce<Record<string, number>>(
    (acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* ── Month Header ─── */}
      <View className="px-6 pt-8 pb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Typo
              variant="muted"
              className="font-mono text-[10px] uppercase tracking-widest mb-1"
            >
              Expense Report
            </Typo>
            <Typo className="text-white font-serif-bold text-3xl">
              {data.month}
            </Typo>
          </View>
          <View className="bg-brand-800 px-4 py-2 rounded-2xl border border-white/5">
            <Typo
              variant="muted"
              className="font-mono text-[9px] uppercase tracking-wider"
            >
              Period
            </Typo>
            <Typo className="text-white font-sans-medium text-sm mt-0.5">
              {data.month_range}
            </Typo>
          </View>
        </View>
      </View>

      {/* ── Summary Card ──── */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        className="mx-6 mb-5"
      >
        <View className="bg-brand-800 rounded-[32px] p-6 border border-white/10">
          <View className="mb-5 items-center">
            <Typo
              variant="muted"
              className="font-mono text-[10px] uppercase tracking-widest mb-2"
            >
              Total Expenses
            </Typo>
            <Typo className="text-white font-serif-bold text-4xl">
              ₹{data.grandTotal.toLocaleString("en-IN")}
            </Typo>
          </View>

          {totalIncome > 0 && (
            <View className="pt-4 border-t border-white/5">
              <View className="flex-row justify-between items-center mb-3">
                <View>
                  <Typo variant="muted" className="text-xs font-mono mb-1">
                    Income
                  </Typo>
                  <Typo className="text-white font-sans-bold text-lg">
                    ₹{totalIncome.toLocaleString("en-IN")}
                  </Typo>
                </View>
                <View className="items-end">
                  <Typo variant="muted" className="text-xs font-mono mb-1">
                    {isOverBudget ? "Deficit" : "Surplus"}
                  </Typo>
                  <Typo
                    className="font-sans-bold text-lg"
                    style={{
                      color: isOverBudget
                        ? colors.danger[500]
                        : colors.success[500],
                    }}
                  >
                    {isOverBudget ? "−" : "+"}₹
                    {Math.abs(surplus).toLocaleString("en-IN")}
                  </Typo>
                </View>
              </View>
              <View className="h-2 bg-white/5 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((data.grandTotal / totalIncome) * 100, 100)}%`,
                    backgroundColor: isOverBudget
                      ? colors.danger[500]
                      : colors.success[500],
                  }}
                />
              </View>
              <Typo
                variant="muted"
                className="text-[10px] font-mono text-right mt-2"
              >
                {Math.abs(surplusPercentage).toFixed(1)}%{" "}
                {isOverBudget ? "over budget" : "remaining"}
              </Typo>
            </View>
          )}
        </View>
      </Animated.View>

      {/* ── Tab Switcher ─── */}
      <Animated.View
        entering={FadeInDown.delay(160).duration(350)}
        className="mx-6 mb-5"
      >
        <View className="flex-row bg-brand-800 rounded-2xl p-1 border border-white/5">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.75}
                className={`flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl ${
                  isActive ? "bg-brand-500" : ""
                }`}
              >
                <Icon
                  size={13}
                  color={
                    isActive ? colors.white : (colors.text?.muted ?? "#888")
                  }
                />
                <Typo
                  className={`font-mono text-[11px] ${
                    isActive ? "text-white font-mono-bold" : "text-white/50"
                  }`}
                >
                  {tab.label}
                </Typo>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* ── Tab Content ───── */}
      <Animated.View key={activeTab} entering={FadeIn.duration(250)}>
        {/* SUMMARY TAB */}
        {activeTab === "summary" && (
          <>
            {/* Bucket Grid */}
            <View className="px-6 mb-6">
              <Typo
                variant="muted"
                className="font-mono text-[10px] uppercase tracking-widest mb-4"
              >
                Budget Allocation
              </Typo>
              <View className="flex-row gap-3">
                {bucketConfig.map((bucket, index) => {
                  const amount = data.bucketTotals[bucket.type];
                  const percentage = getBucketPercentage(bucket.type);

                  return (
                    <Animated.View
                      key={bucket.type}
                      entering={FadeInDown.delay(200 + index * 100).duration(
                        400,
                      )}
                      className="flex-1"
                    >
                      <View className="bg-brand-800 rounded-[24px] p-4 border border-white/5">
                        <View
                          className="w-10 h-10 rounded-2xl items-center justify-center mb-3 self-center"
                          style={{ backgroundColor: bucket.bgColor }}
                        >
                          <bucket.icon size={20} color={bucket.color} />
                        </View>
                        <Typo
                          variant="muted"
                          className="font-mono text-[9px] uppercase tracking-wider mb-1"
                        >
                          {bucket.label}
                        </Typo>
                        <Typo className="text-white font-sans-bold text-base mb-1">
                          ₹{(amount / 1000).toFixed(0)}k
                        </Typo>
                        <View className="flex-row items-center">
                          <Typo
                            className="font-mono text-xs"
                            style={{ color: bucket.color }}
                          >
                            {percentage}%
                          </Typo>
                          <Typo
                            variant="muted"
                            className="text-[9px] font-mono ml-1"
                          >
                            /{bucket.ideal}%
                          </Typo>
                        </View>
                      </View>
                    </Animated.View>
                  );
                })}
              </View>
            </View>

            {/* Simple category list (summary tab) */}
            <View className="px-6 pb-4">
              <Typo
                variant="muted"
                className="font-mono text-[10px] uppercase tracking-widest mb-4"
              >
                Top Categories
              </Typo>
              <View className="bg-brand-800 rounded-[28px] border border-white/5 overflow-hidden">
                {Object.entries(data.categoryTotals)
                  .filter(([, v]) => v > 0)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([category, amount], index, arr) => {
                    const percentage =
                      totalIncome > 0
                        ? ((amount / totalIncome) * 100).toFixed(1)
                        : "0.0";
                    return (
                      <Animated.View
                        key={category}
                        entering={FadeInDown.delay(300 + index * 50).duration(
                          300,
                        )}
                        className={`flex-row items-center justify-between px-5 py-4 ${
                          index !== arr.length - 1
                            ? "border-b border-white/[0.04]"
                            : ""
                        }`}
                      >
                        <View className="flex-1">
                          <Typo className="text-white font-sans-medium text-sm mb-0.5">
                            {category}
                          </Typo>
                          <Typo variant="muted" className="text-xs font-mono">
                            {percentage}% of income
                          </Typo>
                        </View>
                        <Typo className="text-white font-sans-bold text-base">
                          ₹{amount.toLocaleString("en-IN")}
                        </Typo>
                      </Animated.View>
                    );
                  })}
              </View>
              {/* Prompt to switch tabs */}
              <TouchableOpacity
                onPress={() => setActiveTab("categories")}
                className="mt-3 items-center"
              >
                <Typo className="text-brand-500 font-mono text-xs">
                  View full breakdown →
                </Typo>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === "categories" && (
          <CategoryBreakdownTable
            categoryTotals={data.categoryTotals}
            bucketTotals={data.bucketTotals}
            grandTotal={data.grandTotal}
            totalIncome={totalIncome}
            entryCounts={entryCounts}
          />
        )}

        {/* ENTRIES TAB */}
        {activeTab === "entries" && (
          <ExpensesTable
            entries={data.entries ?? []}
            onUpdateEntry={onUpdateEntry}
            onDeleteEntry={onDeleteEntry}
          />
        )}
      </Animated.View>
    </ScrollView>
  );
};

export default MonthlyExpensesTracker;
