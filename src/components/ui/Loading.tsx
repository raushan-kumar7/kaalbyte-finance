import { View, ActivityIndicator, Modal } from "react-native";
import React from "react";
import { colors } from "@/src/constants/colors";
import Typo from "./Typo";

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
  size?: "small" | "large";
}

const Loading = ({ 
  fullScreen = false, 
  message = "Authenticating...", 
  size = "large" 
}: LoadingProps) => {
  
  const LoaderContent = (
    <View className={fullScreen ? "flex-1 bg-brand-900/95 justify-center items-center" : "py-10 justify-center items-center"}>
      <View className="p-6 rounded-3xl bg-brand-800 border border-ui-border items-center shadow-2xl">
        <ActivityIndicator size={size} color={colors.gold[500]} />
        {message && (
          <Typo className="mt-4 text-gold-500 font-mono-medium text-xs uppercase tracking-[3px]">
            {message}
          </Typo>
        )}
      </View>
    </View>
  );

  if (fullScreen) {
    return (
      <Modal transparent animationType="fade" visible={true}>
        {LoaderContent}
      </Modal>
    );
  }

  return LoaderContent;
};

export default Loading;