import { View } from "react-native";
import React from "react";
import { Typo } from "../ui";

interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <View className={`items-center gap-4 py-4 ${className}`}>
      <View className="items-center opacity-60">
        <Typo className="text-[11px] text-text-secondary text-center leading-5 font-mono">
          © {currentYear}{" "}
          <Typo className="text-[11px] font-mono-bold text-gold-500 uppercase tracking-widest">
            Kaalbyte Finance
          </Typo>
        </Typo>

        <View className="flex-row items-center mt-1">
          <Typo className="text-[10px] text-text-muted uppercase tracking-tighter">
            All rights reserved
          </Typo>
        </View>
      </View>
    </View>
  );
};

export default Footer;
