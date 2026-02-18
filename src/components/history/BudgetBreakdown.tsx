import React from "react";
import { View } from "react-native";
import { BucketType } from "@/src/types/finance";
import { Typo } from "../ui";

interface Props {
  income: number;
  spent: { [key in BucketType]: number };
}

const BudgetBreakdown = ({ income, spent }: Props) => {
  // Budget caps
  const caps = {
    [BucketType.NEEDS]: income * 0.5,
    [BucketType.WANTS]: income * 0.3,
    [BucketType.SAVINGS]: income * 0.2,
  };

  const getPercentage = (type: BucketType) => (spent[type] / caps[type]) * 100;

  return (
    <View className="bg-ui-card rounded-[40px] p-6 border border-white/5">
      <Typo className="font-mono-bold text-xs text-text-secondary mb-6 uppercase tracking-widest">
        Monthly Rule Check
      </Typo>

      {[BucketType.NEEDS, BucketType.WANTS, BucketType.SAVINGS].map((type) => {
        const percent = getPercentage(type);
        const isOver = percent > 100;
        
        return (
          <View key={type} className="mb-5">
            <View className="flex-row justify-between mb-2">
              <Typo className="font-sans-bold text-white text-sm">{type}</Typo>
              <Typo className={`font-mono-bold text-xs ${isOver ? 'text-danger-500' : 'text-success-500'}`}>
                ₹{spent[type].toLocaleString()} / ₹{caps[type].toLocaleString()}
              </Typo>
            </View>
            <View className="h-2 w-full bg-ui-input rounded-full overflow-hidden">
              <View 
                style={{ width: `${Math.min(percent, 100)}%` }}
                className={type === BucketType.NEEDS ? "bg-brand-500" : type === BucketType.WANTS ? "bg-gold-500" : "bg-success-500"}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default BudgetBreakdown;