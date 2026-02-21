import { Text, TextProps } from "react-native";
import React from "react";
import { cn } from "@/src/utils/cn";
interface TypoProps extends TextProps {
  variant?: "primary" | "secondary" | "muted" | "link" | "inverse";
  className?: string;
}
const Typo = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: TypoProps) => {
  // Dynamic font mapping based on tailwind classes
  const getFontFamily = () => {
    if (className.includes("font-mono-bold")) return "FiraCode-Bold";
    if (className.includes("font-mono")) return "FiraCode-Regular";
    if (className.includes("font-serif-bold")) return "Lora-Bold";
    if (className.includes("font-sans-bold")) return "Inter-Bold";
    return "Inter-Regular";
  };
  const variantStyles = {
    primary: "text-white",
    secondary: "text-text-secondary",
    muted: "text-text-muted",
    link: "text-brand-200",
    inverse: "text-brand-900",
  };
  return (
    <Text
      style={{ fontFamily: getFontFamily() }}
      className={cn("text-base", variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Text>
  );
};
export default Typo;
