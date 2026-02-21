import React from "react";
import {
  View,
  TouchableOpacity,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import {
  ShoppingBag,
  Landmark,
  Coins,
  TrendingUp,
  X,
} from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { BlurView } from "expo-blur";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  Easing,
  ZoomIn,
} from "react-native-reanimated";
import { Typo } from "../ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AddMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectAction: (type: "expense" | "income" | "gold" | "equity") => void;
}

const AddMenu = ({ isVisible, onClose, onSelectAction }: AddMenuProps) => {
  const insets = useSafeAreaInsets();

  const actions = [
    {
      id: "expense",
      label: "Daily Expense",
      icon: ShoppingBag,
      color: colors.danger[500],
      desc: "Food, Rent, Travel",
      tag: "50/30/20",
    },
    {
      id: "income",
      label: "Monthly Income",
      icon: Landmark,
      color: colors.success[500],
      desc: "Salary, Dividends",
      tag: "Budget Base",
    },
    {
      id: "gold",
      label: "Digital Assets",
      icon: Coins,
      color: colors.gold[500],
      desc: "Digital Gold, Silver",
      tag: "Premium",
    },
    {
      id: "equity",
      label: "Equity",
      icon: TrendingUp,
      color: colors.success[500],
      desc: "Stocks, Mutual Funds",
      tag: "Growth",
    },
  ];

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      statusBarTranslucent
    >
      <View className="flex-1 justify-end -mb-5">
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          className="absolute inset-0"
        >
          <Pressable onPress={onClose} className="flex-1">
            <BlurView
              intensity={Platform.OS === "ios" ? 40 : 100}
              tint="dark"
              className="flex-1 bg-brand-900/60"
            />
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={SlideInDown.duration(400).easing(Easing.out(Easing.cubic))}
          exiting={SlideOutDown.duration(300).easing(Easing.in(Easing.cubic))}
          className="bg-brand-800 rounded-t-[40px] border-t border-white/10 shadow-2xl"
          style={{ paddingBottom: Math.max(insets.bottom, 24) }}
        >
          <View className="items-center py-4">
            <View className="w-12 h-1.5 bg-white/10 rounded-full" />
          </View>

          <View className="px-8 pb-4">
            <View className="flex-row justify-between items-center mb-8">
              <View>
                <Typo className="text-white font-serif-bold text-2xl">
                  Log Transaction
                </Typo>
                <Typo className="text-gold-500/60 font-mono text-[9px] uppercase tracking-[3px] mt-1">
                  Financial Records
                </Typo>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="bg-white/5 p-2 rounded-full border border-white/10"
              >
                <X size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View className="gap-y-4 mb-8">
              {actions.map((action, index) => (
                <Animated.View
                  key={action.id}
                  entering={FadeIn.delay(100 + index * 50).duration(300)}
                >
                  <TouchableOpacity
                    onPress={() => onSelectAction(action.id as any)}
                    activeOpacity={0.7}
                    className="flex-row items-center bg-ui-card p-4 rounded-[28px] border border-white/5 shadow-sm"
                  >
                    <Animated.View
                      entering={ZoomIn.delay(200 + index * 50)}
                      className="w-14 h-14 rounded-2xl items-center justify-center border border-white/5"
                      style={{ backgroundColor: `${action.color}15` }}
                    >
                      <action.icon
                        size={24}
                        color={action.color}
                        strokeWidth={2}
                      />
                    </Animated.View>
                    <View className="ml-4 flex-1">
                      <View className="flex-row items-center justify-between">
                        <Typo className="font-sans-bold text-base text-white">
                          {action.label}
                        </Typo>
                        <View className="bg-white/5 px-2 py-0.5 rounded-md">
                          <Typo className="text-[8px] font-mono-bold text-white/40 uppercase">
                            {action.tag}
                          </Typo>
                        </View>
                      </View>
                      <Typo className="text-text-secondary text-xs mt-0.5">
                        {action.desc}
                      </Typo>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            <Animated.View entering={FadeIn.delay(350).duration(300)}>
              <TouchableOpacity
                onPress={onClose}
                className="bg-gold-500 h-16 rounded-[24px] items-center justify-center shadow-xl shadow-gold-500/20"
                activeOpacity={0.8}
              >
                <Typo className="text-brand-900 font-sans-bold text-lg">
                  Close Menu
                </Typo>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AddMenu;
