import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import React from "react";
import { cn } from "@/src/utils/cn";
import { colors } from "@/src/constants/colors";
import Typo from "./Typo";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "gold" | "danger" | "outline" | "ghost";
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  textClassName?: string;
  leftIcon?: React.ReactNode;
}

const Button = ({
  title,
  variant = "primary",
  loading = false,
  size = "md",
  className = "",
  textClassName = "",
  disabled,
  leftIcon,
  ...props
}: ButtonProps) => {
  
  // Style Mappings
  const variants = {
    primary: "bg-brand-500 shadow-lg shadow-brand-900/40",
    gold: "bg-gold-500 shadow-lg shadow-black/20",
    danger: "bg-danger-500 shadow-lg shadow-danger-900/20",
    outline: "border-2 border-brand-100 bg-transparent",
    ghost: "bg-transparent",
  };

  const textVariants = {
    primary: "primary", // White text
    gold: "inverse",   // Deep navy text on gold background
    danger: "primary", // White text
    outline: "primary",
    ghost: "secondary",
  } as const;

  const sizes = {
    sm: "h-10 px-4 rounded-xl",
    md: "h-14 px-6 rounded-2xl",
    lg: "h-16 px-8 rounded-2xl",
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      className={cn(
        "flex-row items-center justify-center overflow-hidden",
        variants[variant],
        sizes[size],
        (disabled || loading) && "opacity-50",
        className
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === "gold" ? colors.brand[900] : colors.white} 
        />
      ) : (
        <View className="flex-row items-center justify-center">
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <Typo
            variant={textVariants[variant]}
            className={cn(
              "text-base font-mono-bold uppercase tracking-wider",
              variant === "gold" ? "text-brand-900" : "", // Ensure dark text on gold
              textClassName
            )}
          >
            {title}
          </Typo>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;