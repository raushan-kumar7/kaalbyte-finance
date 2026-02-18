import React from "react";
import Toast from "react-native-toast-message";
import { View, Text } from "react-native";
import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react-native";
import { colors } from "@/src/constants/colors";

const toastConfig = {
  success: (props: any) => (
    <View className="w-[90%] bg-ui-card border-l-4 border-success-500 rounded-xl p-4 flex-row items-center shadow-lg">
      <View className="w-10 h-10 rounded-full bg-success-500/20 items-center justify-center mr-3">
        <CheckCircle size={20} color={colors.success[500]} strokeWidth={2.5} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-sans-semibold text-text-primary mb-1">
          {props.text1}
        </Text>
        {props.text2 ? (
          <Text className="text-sm font-sans text-text-secondary leading-5">
            {props.text2}
          </Text>
        ) : null}
      </View>
    </View>
  ),

  error: (props: any) => (
    <View className="w-[90%] bg-ui-card border-l-4 border-danger-500 rounded-xl p-4 flex-row items-center shadow-lg">
      <View className="w-10 h-10 rounded-full bg-danger-500/20 items-center justify-center mr-3">
        <AlertCircle size={20} color={colors.danger[500]} strokeWidth={2.5} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-sans-semibold text-text-primary mb-1">
          {props.text1}
        </Text>
        {props.text2 ? (
          <Text className="text-sm font-sans text-text-secondary leading-5">
            {props.text2}
          </Text>
        ) : null}
      </View>
    </View>
  ),

  info: (props: any) => (
    <View className="w-[90%] bg-ui-card border-l-4 border-brand-500 rounded-xl p-4 flex-row items-center shadow-lg">
      <View className="w-10 h-10 rounded-full bg-brand-500/20 items-center justify-center mr-3">
        <Info size={20} color={colors.brand[500]} strokeWidth={2.5} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-sans-semibold text-text-primary mb-1">
          {props.text1}
        </Text>
        {props.text2 ? (
          <Text className="text-sm font-sans text-text-secondary leading-5">
            {props.text2}
          </Text>
        ) : null}
      </View>
    </View>
  ),

  warning: (props: any) => (
    <View className="w-[90%] bg-ui-card border-l-4 border-gold-500 rounded-xl p-4 flex-row items-center shadow-lg">
      <View className="w-10 h-10 rounded-full bg-gold-500/20 items-center justify-center mr-3">
        <AlertTriangle size={20} color={colors.gold[500]} strokeWidth={2.5} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-sans-semibold text-text-primary mb-1">
          {props.text1}
        </Text>
        {props.text2 ? (
          <Text className="text-sm font-sans text-text-secondary leading-5">
            {props.text2}
          </Text>
        ) : null}
      </View>
    </View>
  ),
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toast config={toastConfig} />
    </>
  );
};
