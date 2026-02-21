import React from "react";
import { View } from "react-native";
import { Typo } from "../ui";

interface TransactionItem {
  category: string;
  amount: number;
  bucket: string;
  description?: string;
}

interface Props {
  date: string;
  total: number;
  items: TransactionItem[];
}

const TransactionGroup = ({ date, total, items }: Props) => {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3 px-2">
        <Typo className="font-mono-bold text-[10px] text-gold-500 uppercase tracking-widest">
          {date}
        </Typo>
        <Typo className="font-mono-bold text-xs text-white">
          ₹{total.toLocaleString()}
        </Typo>
      </View>

      <View className="bg-ui-card rounded-3xl border border-white/5 overflow-hidden">
        {items.map((item, index) => (
          <View
            key={index}
            className={`flex-row justify-between items-center p-4 ${index !== items.length - 1 ? "border-b border-white/5" : ""}`}
          >
            <View className="flex-row items-center flex-1">
              <View
                className={`w-1 h-8 rounded-full mr-4 ${
                  item.bucket === "Needs"
                    ? "bg-brand-500"
                    : item.bucket === "Wants"
                      ? "bg-gold-500"
                      : "bg-success-500"
                }`}
              />
              <View>
                <Typo className="text-white font-sans-semibold text-sm">
                  {item.category}
                </Typo>
                {item.description && (
                  <Typo
                    variant="muted"
                    className="text-[10px] font-mono uppercase italic"
                  >
                    {item.description}
                  </Typo>
                )}
              </View>
            </View>
            <Typo className="text-white font-mono-bold">₹{item.amount}</Typo>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TransactionGroup;
