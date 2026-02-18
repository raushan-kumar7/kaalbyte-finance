import React from "react";
import { View } from "react-native";
import { Typo } from "../ui";

interface Props {
  income: number;
  spent: { Needs: number; Wants: number; Savings: number };
}

const BudgetStatusHeader = ({ income, spent }: Props) => {
  const totalSpent = spent.Needs + spent.Wants + spent.Savings;
  const remaining = income - totalSpent;

  return (
    <View className="bg-brand-800 rounded-[32px] p-6 mb-6 border border-white/5 shadow-2xl">
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Typo
            variant="secondary"
            className="font-mono-bold text-[10px] uppercase tracking-[2px]"
          >
            Safe to Spend
          </Typo>
          <Typo className="text-3xl font-serif-bold text-white">
            ₹{remaining.toLocaleString()}
          </Typo>
        </View>
        <View className="bg-success-500/10 px-3 py-1 rounded-full border border-success-500/20">
          <Typo className="text-success-500 font-mono-bold text-[10px]">
            + ₹{income.toLocaleString()}
          </Typo>
        </View>
      </View>

      {/* Tri-Color Progress Bar */}
      <View className="h-3 w-full bg-ui-input rounded-full flex-row overflow-hidden mb-3">
        <View
          style={{ width: "50%" }}
          className="bg-brand-500 h-full border-r border-brand-900"
        />
        <View
          style={{ width: "30%" }}
          className="bg-gold-500 h-full border-r border-brand-900"
        />
        <View style={{ width: "20%" }} className="bg-success-500 h-full" />
      </View>

      <View className="flex-row justify-between">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-brand-500 mr-1.5" />
          <Typo className="text-[9px] font-mono-bold text-text-secondary">
            NEEDS
          </Typo>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-gold-500 mr-1.5" />
          <Typo className="text-[9px] font-mono-bold text-text-secondary">
            WANTS
          </Typo>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-success-500 mr-1.5" />
          <Typo className="text-[9px] font-mono-bold text-text-secondary">
            SAVINGS
          </Typo>
        </View>
      </View>
    </View>
  );
};

export default BudgetStatusHeader;
