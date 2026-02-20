import React, { useEffect, useMemo, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { colors } from "@/src/constants/colors";
import { BucketType, CATEGORIES } from "@/src/types/finance";
import { Typo } from "../ui";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CategoryBreakdownTableProps {
  categoryTotals: Record<string, number>;
  bucketTotals: Record<BucketType, number>;
  grandTotal: number;
  totalIncome?: number;
  /** Optional: show entry count per category */
  entryCounts?: Record<string, number>;
}

// ─── Bucket config ────────────────────────────────────────────────────────────

const BUCKET_META: Record<
  BucketType,
  { label: string; idealPct: number; color: string; bg: string; border: string }
> = {
  [BucketType.NEEDS]: {
    label: "Needs",
    idealPct: 50,
    color: colors.success[500],
    bg: `${colors.success[500]}12`,
    border: `${colors.success[500]}25`,
  },
  [BucketType.WANTS]: {
    label: "Wants",
    idealPct: 30,
    color: colors.danger[500],
    bg: `${colors.danger[500]}12`,
    border: `${colors.danger[500]}25`,
  },
  [BucketType.SAVINGS]: {
    label: "Savings",
    idealPct: 20,
    color: colors.gold[500],
    bg: `${colors.gold[500]}12`,
    border: `${colors.gold[500]}25`,
  },
};

// ─── Category Row ─────────────────────────────────────────────────────────────

interface CategoryRowProps {
  category: string;
  amount: number;
  grandTotal: number;
  totalIncome: number;
  entryCount?: number;
  color: string;
  index: number;
  isLast: boolean;
}

const CategoryRow = ({
  category,
  amount,
  grandTotal,
  totalIncome,
  entryCount,
  color,
  index,
  isLast,
}: CategoryRowProps) => {
  const spendPct = grandTotal > 0 ? (amount / grandTotal) * 100 : 0;
  const incomePct = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
  const barWidth = useSharedValue(0);

  useEffect(() => {
    barWidth.value = withTiming(spendPct, { duration: 600 + index * 60 });
  }, [spendPct, barWidth, index]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%`,
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(300)}
      className={`px-5 py-4 ${!isLast ? "border-b border-white/[0.04]" : ""}`}
    >
      {/* Top row */}
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-3">
          {/* Left accent line + name */}
          <View className="flex-row items-center gap-2">
            <View
              className="w-1 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            <Typo className="text-white font-sans-medium text-[13px]">
              {category}
            </Typo>
          </View>
          <View className="flex-row items-center gap-3 mt-1 ml-3">
            {entryCount !== undefined && (
              <Typo variant="muted" className="text-[10px] font-mono">
                {entryCount} {entryCount === 1 ? "entry" : "entries"}
              </Typo>
            )}
            {totalIncome > 0 && (
              <Typo variant="muted" className="text-[10px] font-mono">
                {incomePct.toFixed(1)}% of income
              </Typo>
            )}
          </View>
        </View>

        {/* Amount + spend% */}
        <View className="items-end">
          <Typo className="text-white font-sans-bold text-base">
            ₹{amount.toLocaleString("en-IN")}
          </Typo>
          <Typo
            className="font-mono text-[10px] mt-0.5"
            style={{ color }}
          >
            {spendPct.toFixed(1)}%
          </Typo>
        </View>
      </View>

      {/* Progress bar */}
      <View className="h-1 bg-white/5 rounded-full overflow-hidden ml-3">
        <Animated.View
          style={[barStyle, { height: "100%", backgroundColor: color, borderRadius: 99 }]}
        />
      </View>
    </Animated.View>
  );
};

// ─── Bucket Section ───────────────────────────────────────────────────────────

interface BucketSectionProps {
  bucket: BucketType;
  categories: { name: string; amount: number; entryCount?: number }[];
  bucketTotal: number;
  grandTotal: number;
  totalIncome: number;
  startIndex: number;
}

const BucketSection = ({
  bucket,
  categories,
  bucketTotal,
  grandTotal,
  totalIncome,
  startIndex,
}: BucketSectionProps) => {
  const [expanded, setExpanded] = useState(true);
  const meta = BUCKET_META[bucket];
  const incomePct = totalIncome > 0 ? (bucketTotal / totalIncome) * 100 : 0;
  const isOverIdeal = incomePct > meta.idealPct;

  return (
    <Animated.View
      entering={FadeInDown.delay(startIndex * 50).duration(350)}
      className="mb-4"
    >
      {/* Bucket header card */}
      <TouchableOpacity
        onPress={() => setExpanded((p) => !p)}
        activeOpacity={0.75}
        className="rounded-[20px] px-5 py-4 border flex-row items-center justify-between mb-2"
        style={{ backgroundColor: meta.bg, borderColor: meta.border }}
      >
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: meta.color }}
            />
            <Typo
              className="font-sans-bold text-base"
              style={{ color: meta.color }}
            >
              {meta.label}
            </Typo>
            <View
              className="px-2 py-0.5 rounded-lg"
              style={{ backgroundColor: `${meta.color}20` }}
            >
              <Typo
                className="font-mono text-[9px] uppercase tracking-wider"
                style={{ color: meta.color }}
              >
                ideal {meta.idealPct}%
              </Typo>
            </View>
          </View>

          <View className="flex-row items-center gap-4">
            <Typo className="text-white font-serif-bold text-xl">
              ₹{bucketTotal.toLocaleString("en-IN")}
            </Typo>
            {totalIncome > 0 && (
              <Typo
                className="font-mono text-xs"
                style={{ color: isOverIdeal ? colors.danger[500] : meta.color }}
              >
                {incomePct.toFixed(1)}% {isOverIdeal ? "↑ over" : "✓"}
              </Typo>
            )}
          </View>
        </View>

        {expanded ? (
          <ChevronDown size={18} color={meta.color} />
        ) : (
          <ChevronRight size={18} color={meta.color} />
        )}
      </TouchableOpacity>

      {/* Category rows */}
      {expanded && categories.length > 0 && (
        <View className="bg-brand-800 rounded-[20px] border border-white/5 overflow-hidden">
          {categories.map((cat, i) => (
            <CategoryRow
              key={cat.name}
              category={cat.name}
              amount={cat.amount}
              grandTotal={grandTotal}
              totalIncome={totalIncome}
              entryCount={cat.entryCount}
              color={meta.color}
              index={i}
              isLast={i === categories.length - 1}
            />
          ))}
        </View>
      )}

      {expanded && categories.length === 0 && (
        <View className="bg-brand-800 rounded-[20px] border border-white/5 py-6 items-center">
          <Typo variant="muted" className="font-mono text-xs">
            No expenses in {meta.label}
          </Typo>
        </View>
      )}
    </Animated.View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const CategoryBreakdownTable = ({
  categoryTotals,
  bucketTotals,
  grandTotal,
  totalIncome = 0,
  entryCounts,
}: CategoryBreakdownTableProps) => {
  // Group categories by bucket, sorted by amount desc
  const groupedByBucket = useMemo(() => {
    return [BucketType.NEEDS, BucketType.WANTS, BucketType.SAVINGS].map((bucket) => {
      const cats = Object.values(CATEGORIES)
        .filter((cat) => cat.bucket === bucket)
        .map((cat) => ({
          name: cat.label,
          amount: categoryTotals[cat.label] ?? 0,
          entryCount: entryCounts?.[cat.label],
        }))
        .filter((c) => c.amount > 0)
        .sort((a, b) => b.amount - a.amount);

      return { bucket, categories: cats };
    });
  }, [categoryTotals, entryCounts]);

  let rowIndex = 0;

  return (
    <View className="px-6 pb-8">
      {/* Section header */}
      <View className="flex-row items-center justify-between mb-4">
        <Typo variant="muted" className="font-mono text-[10px] uppercase tracking-widest">
          Category Breakdown
        </Typo>
        <Typo variant="muted" className="font-mono text-[10px]">
          Grouped by bucket
        </Typo>
      </View>

      {grandTotal === 0 ? (
        <View className="bg-brand-800 rounded-[24px] border border-white/5 py-12 items-center">
          <Typo variant="muted" className="font-mono text-sm">
            No expenses to display
          </Typo>
        </View>
      ) : (
        groupedByBucket.map(({ bucket, categories }) => {
          const section = (
            <BucketSection
              key={bucket}
              bucket={bucket}
              categories={categories}
              bucketTotal={bucketTotals[bucket]}
              grandTotal={grandTotal}
              totalIncome={totalIncome}
              startIndex={rowIndex}
            />
          );
          rowIndex += categories.length + 1;
          return section;
        })
      )}
    </View>
  );
};

export default CategoryBreakdownTable;