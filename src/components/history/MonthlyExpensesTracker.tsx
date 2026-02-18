import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { BucketType, CATEGORIES } from "@/src/types/finance";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Typo } from "../ui";

export interface MonthlyExpensesTrackerProps {
  data: {
    month: string;
    month_range: string;
    categoryTotals: Record<string, number>;
    bucketTotals: {
      [K in BucketType]: number;
    };
    grandTotal: number;
  };
  totalIncome?: number;
  isLoading?: boolean;
}

const MonthlyExpensesTracker = ({ 
  data, 
  totalIncome = 0,
  isLoading = false,
}: MonthlyExpensesTrackerProps) => {
  const [selectedBucket, setSelectedBucket] = useState<BucketType | "all">("all");

  // Show loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.gold[500]} />
        <Typo variant="muted" className="font-mono text-xs mt-4 uppercase tracking-widest">
          Loading...
        </Typo>
      </View>
    );
  }

  // Calculate percentages and surplus
  const surplus = totalIncome - data.grandTotal;
  const surplusPercentage = totalIncome > 0 ? (surplus / totalIncome) * 100 : 0;
  const isOverBudget = surplus < 0;

  // Bucket configuration with 50/30/20 rule
  const bucketConfig = [
    {
      type: BucketType.NEEDS,
      label: "Needs",
      color: colors.success[500],
      bgColor: `${colors.success[500]}15`,
      icon: Wallet,
      ideal: 50,
      description: "Essential expenses",
    },
    {
      type: BucketType.WANTS,
      label: "Wants",
      color: colors.danger[500],
      bgColor: `${colors.danger[500]}15`,
      icon: TrendingUp,
      ideal: 30,
      description: "Lifestyle & leisure",
    },
    {
      type: BucketType.SAVINGS,
      label: "Savings",
      color: colors.gold[500],
      bgColor: `${colors.gold[500]}15`,
      icon: TrendingDown,
      ideal: 20,
      description: "Investments & assets",
    },
  ];

  // Calculate actual percentages
  const getBucketPercentage = (bucket: BucketType) => {
    return totalIncome > 0 
      ? ((data.bucketTotals[bucket] / totalIncome) * 100).toFixed(1)
      : "0.0";
  };

  // Filter categories by bucket
  const getFilteredCategories = () => {
    const allCategoriesWithBuckets = Object.values(CATEGORIES).map((cat) => ({
      label: cat.label,
      bucket: cat.bucket,
      amount: data.categoryTotals[cat.label] || 0,
    }));

    const filtered = selectedBucket === "all" 
      ? allCategoriesWithBuckets
      : allCategoriesWithBuckets.filter((cat) => cat.bucket === selectedBucket);

    return filtered
      .filter((cat) => cat.amount > 0)
      .map((cat) => [cat.label, cat.amount] as [string, number]);
  };

  return (
    <ScrollView 
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Header with Month Info */}
      <View className="px-6 pt-8 pb-6">
        <View className="flex-row items-center justify-between mb-2">
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
            <Typo variant="muted" className="font-mono text-[9px] uppercase tracking-wider">
              Period
            </Typo>
            <Typo className="text-white font-sans-medium text-sm mt-0.5">
              {data.month_range}
            </Typo>
          </View>
        </View>
      </View>

      {/* Financial Summary Card */}
      <Animated.View 
        entering={FadeInDown.delay(100).duration(400)}
        className="mx-6 mb-6"
      >
        <View className="bg-brand-800 rounded-[32px] p-6 border border-white/10">
          {/* Total Expenses */}
          <View className="mb-6 items-center">
            <Typo variant="muted" className="font-mono text-[10px] uppercase tracking-widest mb-2">
              Total Expenses
            </Typo>
            <Typo className="text-white font-serif-bold text-4xl">
              ₹{data.grandTotal.toLocaleString("en-IN")}
            </Typo>
          </View>

          {/* Income vs Expense */}
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
                  <Typo 
                    variant="muted" 
                    className="text-xs font-mono mb-1"
                  >
                    {isOverBudget ? "Deficit" : "Surplus"}
                  </Typo>
                  <Typo 
                    className="font-sans-bold text-lg"
                    style={{ 
                      color: isOverBudget ? colors.danger[500] : colors.success[500] 
                    }}
                  >
                    {isOverBudget ? "-" : "+"}₹{Math.abs(surplus).toLocaleString("en-IN")}
                  </Typo>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="h-2 bg-white/5 rounded-full overflow-hidden">
                <View 
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((data.grandTotal / totalIncome) * 100, 100)}%`,
                    backgroundColor: isOverBudget ? colors.danger[500] : colors.success[500],
                  }}
                />
              </View>
              <Typo variant="muted" className="text-[10px] font-mono text-right mt-2">
                {Math.abs(surplusPercentage).toFixed(1)}% {isOverBudget ? "over budget" : "remaining"}
              </Typo>
            </View>
          )}
        </View>
      </Animated.View>

      {/* 50/30/20 Buckets Grid */}
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
            const isActive = selectedBucket === bucket.type;

            return (
              <Animated.View 
                key={bucket.type}
                entering={FadeInDown.delay(200 + index * 100).duration(400)}
                className="flex-1"
              >
                <TouchableOpacity
                  onPress={() => setSelectedBucket(isActive ? "all" : bucket.type)}
                  activeOpacity={0.7}
                  className={`rounded-[24px] p-4 border ${
                    isActive 
                      ? "border-white/20 bg-white/5" 
                      : "border-white/5 bg-brand-800"
                  }`}
                >
                  {/* Icon */}
                  <View 
                    className="w-10 h-10 rounded-2xl items-center justify-center mb-3"
                    style={{ backgroundColor: bucket.bgColor }}
                  >
                    <bucket.icon size={20} color={bucket.color} />
                  </View>

                  {/* Label */}
                  <Typo 
                    variant="muted" 
                    className="font-mono text-[9px] uppercase tracking-wider mb-1"
                  >
                    {bucket.label}
                  </Typo>

                  {/* Amount */}
                  <Typo className="text-white font-sans-bold text-base mb-1">
                    ₹{(amount / 1000).toFixed(0)}k
                  </Typo>

                  {/* Percentage */}
                  <View className="flex-row items-center">
                    <Typo 
                      className="font-mono text-xs"
                      style={{ color: bucket.color }}
                    >
                      {percentage}%
                    </Typo>
                    <Typo variant="muted" className="text-[9px] font-mono ml-1">
                      /{bucket.ideal}%
                    </Typo>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Category Breakdown */}
      <View className="px-6 pb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Typo 
            variant="muted" 
            className="font-mono text-[10px] uppercase tracking-widest"
          >
            Category Breakdown
          </Typo>
          {selectedBucket !== "all" && (
            <TouchableOpacity onPress={() => setSelectedBucket("all")}>
              <Typo className="text-brand-500 font-mono text-xs">
                View All
              </Typo>
            </TouchableOpacity>
          )}
        </View>

        <View className="bg-brand-800 rounded-[32px] p-6 border border-white/5">
          {getFilteredCategories().length > 0 ? (
            getFilteredCategories().map(([category, amount], index) => {
              const percentage = totalIncome > 0 
                ? ((amount / totalIncome) * 100).toFixed(1)
                : "0.0";

              return (
                <Animated.View
                  key={category}
                  entering={FadeInDown.delay(300 + index * 50).duration(300)}
                >
                  <View 
                    className={`flex-row items-center justify-between py-4 ${
                      index !== getFilteredCategories().length - 1 
                        ? "border-b border-white/5" 
                        : ""
                    }`}
                  >
                    <View className="flex-1">
                      <Typo className="text-white font-sans-medium text-base mb-1">
                        {category}
                      </Typo>
                      <Typo variant="muted" className="text-xs font-mono">
                        {percentage}% of income
                      </Typo>
                    </View>
                    <Typo className="text-white font-sans-bold text-lg">
                      ₹{amount.toLocaleString("en-IN")}
                    </Typo>
                  </View>
                </Animated.View>
              );
            })
          ) : (
            <View className="py-8 items-center">
              <Typo variant="muted" className="font-mono text-sm">
                No expenses in this category
              </Typo>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default MonthlyExpensesTracker;