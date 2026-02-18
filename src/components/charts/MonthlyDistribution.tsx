import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { colors } from "@/src/constants/colors";
import { Typo } from "../ui";
import { Eye, EyeOff, ShieldCheck } from "lucide-react-native";
import { useMonthlyExpenseSummary, useMonthlyIncome } from "@/src/hooks";
import { getCurrentMonthStr } from "@/src/utils/date";

const MonthlyDistribution = () => {
  // State for Privacy Mode and Selected Slice
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    label: string;
    amount: string;
    percent: number;
  } | null>(null);

  const { income } = useMonthlyIncome(getCurrentMonthStr());
  const { summary } = useMonthlyExpenseSummary(getCurrentMonthStr());

  const totalBudget = income?.totalIncome || 0;
  const needsAmount = summary?.bucketTotals?.needs || 0;
  const wantsAmount = summary?.bucketTotals?.wants || 0;
  const savingsAmount = summary?.bucketTotals?.savings || 0;

  const hasData = Boolean(summary && summary.grandTotal > 0);

  const calculatePercent = (val: number) => {
    if (totalBudget === 0 || val === 0) return 0;
    return Math.ceil((val / totalBudget) * 100);
  };

  const needsPercent = hasData ? calculatePercent(needsAmount) : 50;
  const wantsPercent = hasData ? calculatePercent(wantsAmount) : 30;
  const savingsPercent = hasData ? calculatePercent(savingsAmount) : 20;

  const pieData = [
    {
      value: needsPercent,
      color: colors.brand[500],
      gradientCenterColor: colors.brand[600],
      text: "Needs",
      actualValue: needsAmount,
    },
    {
      value: wantsPercent,
      color: colors.gold[500],
      gradientCenterColor: colors.gold[600],
      text: "Wants",
      actualValue: wantsAmount,
    },
    {
      value: savingsPercent,
      color: colors.success[500],
      gradientCenterColor: colors.success[500],
      text: "Savings",
      actualValue: savingsAmount,
    },
  ];

  const handlePress = (item: any) => {
    const val = item?.actualValue ?? 0;
    setSelectedCategory({
      label: item.text || "Category",
      amount: `₹${val.toLocaleString()}`,
      percent: item.value || 0,
    });
  };

  return (
    <View className="bg-brand-800 rounded-[32px] p-6 border border-white/5 items-center shadow-2xl">
      {/* Header with Privacy Toggle */}
      <View className="flex-row justify-between w-full mb-6 px-2">
        <View className="flex-row items-center">
          <ShieldCheck size={12} color={colors.gold[500]} />
          <Typo
            variant="muted"
            className="font-mono text-[9px] uppercase tracking-[2px] ml-2"
          >
            Bucket Allocation
          </Typo>
        </View>

        <TouchableOpacity
          onPress={() => setIsPrivate(!isPrivate)}
          activeOpacity={0.7}
          className="bg-white/5 p-2 rounded-full border border-white/10"
        >
          {isPrivate ? (
            <Eye size={14} color={colors.gold[500]} />
          ) : (
            <EyeOff size={14} color={colors.text.muted} />
          )}
        </TouchableOpacity>
      </View>

      {/* Interactive Pie Chart */}
      <PieChart
        data={pieData.some((d) => d.value > 0) ? pieData : [{ value: 1, color: colors.brand[800] }]}
        donut
        showGradient
        sectionAutoFocus
        focusOnPress
        toggleFocusOnPress
        onPress={handlePress}
        radius={85}
        innerRadius={62}
        innerCircleColor={colors.brand[800]}
        // Logic for Center Label
        centerLabelComponent={() => (
          <View className="items-center justify-center">
            <Typo className="text-white font-serif-bold text-xl leading-tight">
              {isPrivate
                ? "****"
                : selectedCategory
                  ? selectedCategory.amount
                  : `₹${(totalBudget / 1000).toFixed(1)}k`}
            </Typo>
            <Typo className="text-gold-500 font-mono-bold text-[8px] uppercase tracking-[1.5px] mt-1">
              {selectedCategory ? selectedCategory.label : "Total Budget"}
            </Typo>
          </View>
        )}
      />

      {/* Interactive Legend Grid */}
      <View className="flex-row justify-around w-full mt-10">
        {pieData.map((item, i) => {
          const isActive = selectedCategory?.label === item.text;

          return (
            <View
              key={i}
              className={`items-center px-4 py-2.5 rounded-[20px] border ${
                isActive ? "bg-white/5 border-white/10" : "border-transparent"
              }`}
            >
              <View
                className="w-1.5 h-1.5 rounded-full mb-2"
                style={{ backgroundColor: item.color }}
              />
              <Typo
                className={`text-[8px] font-mono uppercase tracking-wider ${isActive ? "text-white" : "text-text-muted"}`}
              >
                {item.text}
              </Typo>
              <Typo
                className={`font-sans-bold text-[11px] mt-0.5 ${isActive ? "text-white" : "text-white/60"}`}
              >
                {isPrivate ? "**%" : `${item.value}%`}
              </Typo>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default MonthlyDistribution;