import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";

// Prevent the splash screen from hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

interface FontLoaderProps {
  children: React.ReactNode;
}

const FontLoader = ({ children }: FontLoaderProps) => {
  const [loaded, error] = useFonts({
    // --- INTER (UI & Body) ---
    // Using 18pt static files as they are optimized for mobile screen densities
    "Inter-Regular": require("@/assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter-Medium": require("@/assets/fonts/Inter_18pt-Medium.ttf"),
    "Inter-SemiBold": require("@/assets/fonts/Inter_18pt-SemiBold.ttf"),
    "Inter-Bold": require("@/assets/fonts/Inter_18pt-Bold.ttf"),

    // --- FIRA CODE (Financial Data & Monospace) ---
    // Essential for clear, readable transaction IDs and balances
    "FiraCode-Regular": require("@/assets/fonts/FiraCode-Regular.ttf"),
    "FiraCode-Medium": require("@/assets/fonts/FiraCode-Medium.ttf"),
    "FiraCode-SemiBold": require("@/assets/fonts/FiraCode-SemiBold.ttf"),
    "FiraCode-Bold": require("@/assets/fonts/FiraCode-Bold.ttf"),

    // --- LORA (Premium Brand Headings) ---
    // The Serif font that gives the "Wealth" feel
    "Lora-Regular": require("@/assets/fonts/Lora-Regular.ttf"),
    "Lora-Medium": require("@/assets/fonts/Lora-Medium.ttf"),
    "Lora-SemiBold": require("@/assets/fonts/Lora-SemiBold.ttf"),
    "Lora-Bold": require("@/assets/fonts/Lora-Bold.ttf"),

    // --- INCONSOLATA (Optional Data Alternative) ---
    // Good to have if you want a thinner monospaced look for logs or secondary data
    "Inconsolata-Regular": require("@/assets/fonts/Inconsolata-Regular.ttf"),
    "Inconsolata-Medium": require("@/assets/fonts/Inconsolata-Medium.ttf"),
    "Inconsolata-Bold": require("@/assets/fonts/Inconsolata-Bold.ttf"),
  });

  useEffect(() => {
    if (!loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return <View style={{ flex: 1, backgroundColor: '#010528' }} />; 
  }

  return <>{children}</>;
};

export default FontLoader;
