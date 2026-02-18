import React from "react";
import { View, Pressable } from "react-native";
import { colors } from "@/src/constants/colors";
import { Sparkles, TrendingUp } from "lucide-react-native";
import { Typo } from "../ui";
import { formatCompactCurrency, formatCurrency } from "@/src/utils/currency";

interface AssetStats {
  totalAssets: number;
  gold: number;
  silver: number;
  equity: number;
}

interface AssetSummaryCardProps {
  assetStats: AssetStats;
  onPress?: () => void;
}

const AssetSummaryCard = ({ assetStats, onPress }: AssetSummaryCardProps) => {
  const { totalAssets, gold, silver, equity } = assetStats;

  return (
    <Pressable 
      onPress={onPress}
      className="bg-brand-800 rounded-[28px] p-5 border border-white/10 shadow-xl mb-6 h-[160px] justify-between active:opacity-90"
    >
      {/* Top Section */}
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <Sparkles size={12} color={colors.success[500]} />
            <Typo className="font-mono-bold text-[10px] uppercase tracking-[1.5px] ml-2 text-success-500">
              Portfolio
            </Typo>
          </View>
          
          <Typo className="text-white font-serif-bold text-3xl leading-none">
            {formatCurrency(totalAssets).full}
          </Typo>
          
          <Typo
            variant="secondary"
            className="font-mono text-[9px] uppercase tracking-wider mt-1 opacity-50"
          >
            Estimated Net Worth
          </Typo>
        </View>

        <View className="bg-success-500/10 p-2.5 rounded-2xl border border-success-500/20">
          <TrendingUp size={18} color={colors.success[500]} />
        </View>
      </View>

      {/* Bottom Section - Asset Breakdown Chips */}
      <View className="flex-row gap-x-2">
        <AssetChip label="Gold" value={gold} color={colors.gold[500]} />
        <AssetChip label="Silver" value={silver} color={colors.brand[100]} />
        <AssetChip label="Equity" value={equity} color={colors.success[500]} />
      </View>
    </Pressable>
  );
};

/**
 * Extracted Sub-component for cleaner layout and maintenance
 */
const AssetChip = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <View className="flex-1 bg-white/5 p-2 px-1 rounded-[18px] border border-white/5 items-center justify-center">
    <Typo style={{ color }} className="font-mono-bold text-[8px] uppercase tracking-tight mb-0.5">
      {label}
    </Typo>
    <Typo className="text-white font-mono-semibold text-[11px]">
      {formatCompactCurrency(value)}
    </Typo>
  </View>
);

export default AssetSummaryCard;