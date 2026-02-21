import { View, StatusBar } from "react-native";
import React from "react";
import { cn } from "@/src/utils/cn";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  className?: string;
  bg?: string;
  withBottomInset?: boolean;
}

const ScreenWrapper = ({
  children,
  className = "",
  bg,
  withBottomInset = false,
}: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: withBottomInset ? insets.bottom : 0,
      }}
      className={cn(bg ? bg : "bg-ui-background", className)}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
};

export default ScreenWrapper;
