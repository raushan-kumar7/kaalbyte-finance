import React from "react";
import { View } from "react-native";
import { Typo } from "../ui";
import { EquityAssets } from "@/src/db/schema";
import { colors } from "@/src/constants/colors";
import { TrendingUp, Building2, Hash } from "lucide-react-native";

interface Props {
  data: EquityAssets;
}

const EquityAssetsCard = ({ data }: Props) => {
  return (
    <View className="bg-ui-card border border-success-500/20 rounded-[32px] p-5 mb-4 shadow-2xl">
      {/* Header: Company & Exchange */}
      <View className="flex-row justify-between items-start mb-5">
        <View className="flex-row items-center flex-1">
          <View className="bg-success-500/10 p-3 rounded-2xl">
            <Building2 size={24} color={colors.success[500]} />
          </View>
          <View className="ml-4 flex-1">
            <Typo
              className="text-white font-sans-bold text-lg leading-tight"
              numberOfLines={1}
            >
              {data.company}
            </Typo>
            <View className="flex-row items-center mt-1">
              <View className="bg-white/10 px-2 py-0.5 rounded-md border border-white/5">
                <Typo className="text-white/60 font-mono-bold text-[9px] uppercase">
                  {data.exchange}
                </Typo>
              </View>
              <Typo
                variant="secondary"
                className="text-[10px] font-mono ml-2"
              >
                {new Date(data.date).toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric",
                })}
              </Typo>
            </View>
          </View>
        </View>
        <View className="items-end">
          <Typo className="text-success-500 font-mono-bold text-lg">
            ₹{data.totalAmount.toLocaleString()}
          </Typo>
          <Typo
            variant="secondary"
            className="text-[10px] font-mono uppercase tracking-tighter"
          >
            Total Invested
          </Typo>
        </View>
      </View>
      {/* Stats Grid */}
      <View className="flex-row justify-between items-center border-t border-white/5 pt-4">
        {/* Quantity */}
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Hash size={10} color={colors.text.muted} />
            <Typo
              variant="secondary"
              className="text-[10px] font-mono-medium uppercase ml-1"
            >
              Shares
            </Typo>
          </View>
          <Typo className="text-white font-mono-semibold text-sm">
            {data.totalShares}
          </Typo>
        </View>
        {/* Buy Price */}
        <View className="flex-1 items-center">
          <Typo
            variant="secondary"
            className="text-[10px] font-mono-medium uppercase mb-1"
          >
            Price Per Share
          </Typo>
          <Typo className="text-white font-mono-semibold text-sm">
            ₹{data.pricePerShare.toLocaleString()}
          </Typo>
        </View>
        {/* Status Indicator */}
        <View className="flex-1 items-end">
          <View className="bg-success-500/10 px-2 py-1 rounded-full flex-row items-center border border-success-500/20">
            <TrendingUp size={10} color={colors.success[500]} />
            <Typo className="text-success-500 font-mono-bold text-[9px] ml-1 uppercase">
              Holding
            </Typo>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EquityAssetsCard;