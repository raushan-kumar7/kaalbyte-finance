import React from "react";
import { View } from "react-native";
import { Typo } from "../ui";
import { DigitalAssets } from "@/src/db/schema";
import { DigitalGoldOrSilverAssetType } from "@/src/types/finance";
import { colors } from "@/src/constants/colors";
import { Scale } from "lucide-react-native";

interface Props {
  data: DigitalAssets;
}

const DigitalAssetsCard = ({ data }: Props) => {
  const isGold = data.type === DigitalGoldOrSilverAssetType.GOLD;
  const assetColor = isGold ? colors.gold[500] : colors.brand[100];
  
  return (
    <View
      className="bg-ui-card border rounded-[32px] p-5 mb-4 shadow-2xl"
      style={{ borderColor: `${assetColor}33` }}
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex flex-row items-center">
          <View
            className="p-3 rounded-2xl"
            style={{ backgroundColor: `${assetColor}1A` }}
          >
            <Scale size={24} color={assetColor} />
          </View>
          <View className="ml-3">
            <Typo className="text-white font-mono-semibold tracking-[2px]">
              {data.platform}
            </Typo>
            <Typo variant="secondary" className="text-[9px] font-mono mt-0.5">
              {new Date(data.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Typo>
          </View>
        </View>
        <View className="items-end">
          <Typo
            className="font-mono-bold text-lg"
            style={{ color: assetColor }}
          >
            {data.weightG}g
          </Typo>
          <Typo variant="secondary" className="text-[10px] font-mono uppercase">
            Net {isGold ? 'Gold' : 'Silver'} Weight
          </Typo>
        </View>
      </View>
      <View className="flex-row justify-between items-center border-t border-white/5 pt-4">
        <View>
          <Typo
            variant="secondary"
            className="text-[10px] font-mono-medium uppercase"
          >
            Purchase Value
          </Typo>
          <Typo className="text-white font-mono-semibold">
            ₹{data.amountPaid.toLocaleString()}
          </Typo>
        </View>
        <View className="items-center">
          <Typo className="text-danger-500 font-mono-medium text-[10px] uppercase">
            GST (3%)
          </Typo>
          <Typo className="text-white font-mono-semibold">
            ₹{data.gst3Percent.toLocaleString()}
          </Typo>
        </View>
        <View className="items-end">
          <Typo
            variant="secondary"
            className="text-[10px] font-mono-medium uppercase"
          >
            Rate/gm
          </Typo>
          <Typo className="text-white font-mono-semibold">
            ₹{data.ratePerGram.toLocaleString()}
          </Typo>
        </View>
      </View>
    </View>
  );
};

export default DigitalAssetsCard;