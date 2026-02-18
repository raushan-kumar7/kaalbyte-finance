import React, { useState } from "react";
import { View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { colors } from "@/src/constants/colors";
import { Wallet } from "lucide-react-native";
import { Typo } from "../ui";

interface PortfolioSummaryProps {
  goldValue: number;
  silverValue: number;
  equityValue: number;
}

const PortfolioSummaryCard = ({
  goldValue = 0,
  silverValue = 0,
  equityValue = 0,
}: PortfolioSummaryProps) => {
  const totalValue = goldValue + silverValue + equityValue;
  
  const [selectedItem, setSelectedItem] = useState<{
    text: string;
    value: number;
  }>({ text: "Equity", value: equityValue });

  const pieData = [
    {
      value: equityValue || 1,
      color: colors.success[500],
      gradientCenterColor: colors.success[900],
      text: "Equity",
      focused: true,
    },
    {
      value: goldValue || 1,
      color: colors.gold[500],
      gradientCenterColor: colors.gold[900],
      text: "Gold",
    },
    {
      value: silverValue || 1,
      color: colors.brand[100],
      gradientCenterColor: colors.brand[200],
      text: "Silver",
    },
  ];

  return (
    <View className="bg-brand-800 rounded-[28px] p-5 border border-white/5 shadow-2xl mb-6">
      {/* Header - Compact */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <View className="bg-white/5 p-1.5 rounded-lg border border-white/10">
            <Wallet size={14} color={colors.gold[500]} />
          </View>
          <Typo className="ml-2 font-mono-bold text-[9px] uppercase tracking-[1.5px] text-white/60">
            Asset Allocation
          </Typo>
        </View>
        {/* <Typo className="text-success-500 font-mono-bold text-[10px]">
          +4.2% <Typo className="text-white/20 text-[9px]">All Time</Typo>
        </Typo> */}
      </View>

      <View className="flex-row items-center justify-between">
        {/* --- COMPACT PIE CHART --- */}
        <PieChart
          data={pieData}
          donut
          showGradient
          sectionAutoFocus
          radius={60}
          innerRadius={44}
          innerCircleColor={colors.brand[800]}
          focusOnPress
          onPress={(item: any) => setSelectedItem(item)}
          centerLabelComponent={() => (
            <View className="items-center justify-center">
              <Typo className="text-white font-mono-bold text-xs">
                {totalValue > 0 ? Math.round((selectedItem.value / totalValue) * 100) : 0}%
              </Typo>
              <Typo className="text-white/40 font-mono text-[6px] uppercase tracking-tighter">
                {selectedItem.text}
              </Typo>
            </View>
          )}
        />

        {/* Legend Section - Optimized Spacing */}
        <View className="flex-1 ml-5 gap-y-2">
          {pieData.map((item, index) => {
            const isFocused = selectedItem.text === item.text;
            const actualValue = item.text === "Equity" ? equityValue : item.text === "Gold" ? goldValue : silverValue;
            return (
              <View 
                key={index} 
                className={`flex-row items-center justify-between p-1.5 px-2 rounded-xl border ${
                  isFocused ? 'bg-white/5 border-white/10' : 'border-transparent'
                }`}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-1.5 h-1.5 rounded-full mr-1.5"
                    style={{ backgroundColor: item.color }}
                  />
                  <Typo
                    variant="secondary"
                    className={`text-[9px] font-sans-medium ${isFocused ? 'text-white' : 'text-white/40'}`}
                  >
                    {item.text}
                  </Typo>
                </View>
                <Typo className={`font-mono-semibold text-[9px] ${isFocused ? 'text-white' : 'text-white/40'}`}>
                   ₹{actualValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </Typo>
              </View>
            );
          })}
          
          <View className="h-[0.5px] bg-white/10 w-full my-0.5" />
          
          <View className="px-2 flex-row justify-between items-end">
            <View>
              <Typo className="text-white/30 font-mono-bold text-[7px] uppercase">
                Net Value
              </Typo>
              <Typo className="text-white font-serif-bold text-lg leading-tight">
                ₹{totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PortfolioSummaryCard;