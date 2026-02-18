import { View } from "react-native";
import { Typo } from "../ui";

const AssetSummary = () => {
  return (
    <View className="bg-ui-card p-5 rounded-3xl border border-white/5">
      {/** Gold Asset Row */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <View className="bg-gold-500/10 p-3 rounded-2xl mr-4 border border-gold-500/20">
            <Typo className="text-xl">🏆</Typo>
          </View>
          <View>
            <Typo className="text-white font-sans-semibold">
              Physical Gold
            </Typo>
            <Typo className="text-text-secondary text-xs">
              12.450 Grams Net
            </Typo>
          </View>
        </View>
        <Typo className="text-gold-500 font-mono-semibold">₹84,200</Typo>
      </View>

      <View className="h-[1px] bg-white/5 w-full mb-6" />

      {/** Equity Asset Row */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="bg-brand-500/10 p-3 rounded-2xl mr-4 border border-brand-500/20">
            <Typo className="text-xl">📈</Typo>
          </View>
          <View>
            <Typo className="text-white font-sans-semibold">
              Equity Portfolio
            </Typo>
            <Typo className="text-success-500 text-xs">
              +12.4% Growth
            </Typo>
          </View>
        </View>
        <Typo className="text-white font-mono-semibold">₹1,42,000</Typo>
      </View>
    </View>
  );
};

export default AssetSummary;
