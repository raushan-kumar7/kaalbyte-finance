import React, { useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Typo } from "../ui";
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue, 
} from "react-native-reanimated";

interface Props {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const PeriodHeader = ({ activeFilter, onFilterChange }: Props) => {
  const filters = ["Daily", "Weekly", "Monthly"];
  
  const activeIndex = filters.indexOf(activeFilter);
  const animationValue = useSharedValue(0);

  useEffect(() => {
    animationValue.value = withSpring(activeIndex, { 
      damping: 20, 
      stiffness: 150,
      mass: 0.5 
    });
  }, [activeIndex, animationValue]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: (animationValue.value * 100) + '%' } as any],
    };
  });

  return (
    <View className="relative flex-row bg-ui-input rounded-2xl p-1.5 mb-6 overflow-hidden">
      {/* Animated Sliding Background */}
      <Animated.View 
        style={[
          {
            position: 'absolute',
            top: 6,
            left: 6,
            bottom: 6,
            width: `${100 / filters.length}%`,
            borderRadius: 12,
          },
          animatedStyle
        ]}
        className="bg-brand-500 shadow-sm"
      />

      {filters.map((f) => {
        const isActive = activeFilter === f;
        
        return (
          <TouchableOpacity
            key={f}
            activeOpacity={0.8}
            onPress={() => onFilterChange(f)}
            className="flex-1 py-3 items-center justify-center z-10"
          >
            <Typo
              className={`font-mono-bold text-[10px] uppercase tracking-widest ${
                isActive ? "text-white" : "text-text-muted"
              }`}
            >
              {f}
            </Typo>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default PeriodHeader;