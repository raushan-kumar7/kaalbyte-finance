import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  X,
} from "lucide-react-native";
import { colors } from "@/src/constants/colors";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 3000,
  onDismiss,
}) => {
  const scale = useSharedValue(1);

  // Auto-dismiss timer
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getToastConfig = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-success-50",
          border: "border-success-500",
          iconColor: colors.success[500],
          textColor: "text-success-900",
          Icon: CheckCircle,
        };
      case "error":
        return {
          bg: "bg-danger-50",
          border: "border-danger-500",
          iconColor: colors.danger[500],
          textColor: "text-danger-900",
          Icon: XCircle,
        };
      case "warning":
        return {
          bg: "bg-gold-50",
          border: "border-gold-500",
          iconColor: colors.gold[600],
          textColor: "text-gold-900",
          Icon: AlertCircle,
        };
      default:
        return {
          bg: "bg-brand-50",
          border: "border-brand-500",
          iconColor: colors.brand[500],
          textColor: "text-brand-800",
          Icon: Info,
        };
    }
  };

  const config = getToastConfig();
  const { Icon } = config;

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(15)}
      exiting={FadeOutUp.springify().damping(15)}
      style={[animatedStyle]}
      className="mx-4 mb-3"
    >
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}
        className={`${config.bg} border-l-4 ${config.border} rounded-xl p-4 flex-row items-start shadow-lg`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <View className="mr-3">
          <Icon size={24} color={config.iconColor} strokeWidth={2.5} />
        </View>

        <View className="flex-1 mr-2">
          {title && (
            <Text
              className={`font-mono-bold text-base mb-1 ${config.textColor}`}
            >
              {title}
            </Text>
          )}
          <Text className={`font-sans text-sm leading-5 ${config.textColor}`}>
            {message}
          </Text>
        </View>

        <Pressable
          onPress={() => onDismiss(id)}
          hitSlop={10}
          className="opacity-60"
        >
          <X size={20} color={colors.brand[900]} strokeWidth={2} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
};

export default Toast;
