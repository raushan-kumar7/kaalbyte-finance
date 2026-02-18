import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useState } from "react";
import { cn } from "@/src/utils/cn";
import { colors } from "@/src/constants/colors";
import Typo from "./Typo";
import { Eye, EyeOff } from "lucide-react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
}

const Input = ({
  label,
  error,
  containerClassName = "",
  isPassword = false,
  leftIcon,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={cn("flex-col gap-1.5", containerClassName)}>
      {label && (
        <Typo className="text-xs font-mono-medium ml-1 text-text-secondary uppercase tracking-widest">
          {label}
        </Typo>
      )}

      <View
        className={cn(
          "h-14 w-full flex-row items-center rounded-xl border px-4 transition-all",
          // Background shifts slightly lighter when focused for "depth"
          isFocused
            ? "border-gold-500 bg-brand-800"
            : "border-ui-border bg-ui-input",
          error ? "border-danger-500" : "",
        )}
      >
        {/* Optional Left Icon for Finance feel */}
        {leftIcon && <View className="mr-3 opacity-60">{leftIcon}</View>}

        <TextInput
          className="flex-1 text-base text-white font-mono py-0"
          placeholderTextColor={colors.text.muted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          underlineColorAndroid="transparent"
          secureTextEntry={isPassword && !showPassword}
          selectionColor={colors.gold[500]} // Branded cursor
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.5}
            className="p-1"
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.gold[500]} />
            ) : (
              <Eye size={20} color={colors.text.muted} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Typo className="text-xs text-danger-500 ml-1 font-mono-medium">
          {error}
        </Typo>
      ) : null}
    </View>
  );
};

export default Input;
