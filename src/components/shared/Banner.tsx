import React from "react";
import { ImageBackground } from "react-native";
import { View as MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Typo } from "../ui";

const Banner = () => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.96, translateY: 15 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 1000, delay: 200 }}
      className="h-48 w-full rounded-3xl overflow-hidden mb-6 border border-white/5 shadow-2xl"
    >
      <ImageBackground
        source={require("@/assets/images/banner.png")}
        className="flex-1"
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(1, 5, 40, 0.3)", "rgba(1, 5, 40, 0.85)"]}
          locations={[0.3, 1]}
          className="flex-1 justify-end p-5"
        >
          <Typo className="text-white font-serif-bold text-2xl leading-7 mb-1">
            Your Privacy is
          </Typo>
          <Typo className="text-gold-500 font-serif-bold text-2xl leading-7 mb-3">
            Absolute.
          </Typo>

          <Typo className="text-white/50 font-sans-medium text-[10px] uppercase tracking-widest">
            100% Offline • No Cloud • Total Privacy
          </Typo>
        </LinearGradient>
      </ImageBackground>
    </MotiView>
  );
};

export default Banner;
