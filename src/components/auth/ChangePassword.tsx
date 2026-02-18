import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Lock, ShieldCheck, KeyRound } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { Input, Typo } from "../ui";
import { useAuth } from "@/src/hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import { changePasswordSchema, IChangePassword } from "@/src/validations/auth";
import { yupResolver } from "@hookform/resolvers/yup";

interface ChangePasswordProps {
  onSuccess: () => void;
}

const ChangePassword = ({ onSuccess }: ChangePasswordProps) => {
  const { changePassword, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IChangePassword>({
    resolver: yupResolver(changePasswordSchema),
    mode: "onTouched",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: IChangePassword) => {
    try {
      await changePassword(data);
      reset();
      onSuccess();
    } catch (error: any) {}
  };

  return (
    <View className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="py-6">
          <View className="mb-8 items-center">
            <View className="w-16 h-16 rounded-full bg-gold-500/10 items-center justify-center border border-gold-500/20">
              <KeyRound size={30} color={colors.gold[500]} />
            </View>
            <Typo className="text-white font-serif-bold text-xl mt-4 text-center">
              Update Security Key
            </Typo>
            <Typo className="text-text-secondary text-center text-[13px] px-10 mt-2">
              Ensure your new password is secure and not used on other
              platforms.
            </Typo>
          </View>

          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Current Password"
                placeholder="••••••••"
                isPassword
                leftIcon={<Lock size={18} color={colors.gold[500]} />}
                value={value}
                onChangeText={onChange}
                containerClassName="mb-6"
                error={errors.currentPassword?.message}
              />
            )}
          />

          <View className="h-[1px] bg-white/5 w-full mb-8" />

          {/* New Password */}
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label="New Password"
                placeholder="Enter new password"
                isPassword
                error={errors.newPassword?.message}
                leftIcon={<ShieldCheck size={18} color={colors.gold[500]} />}
                value={value}
                onChangeText={onChange}
                containerClassName="mb-6"
              />
            )}
          />

          {/* Confirm New Password */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Confirm New Password"
                placeholder="Repeat new password"
                isPassword
                error={errors.confirmPassword?.message}
                leftIcon={<ShieldCheck size={18} color={colors.gold[500]} />}
                value={value}
                onChangeText={onChange}
                containerClassName="mb-10"
              />
            )}
          />

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            activeOpacity={0.8}
            className={`h-14 rounded-2xl items-center justify-center ${isLoading ? "bg-gold-500/50" : "bg-gold-500"}`}
          >
            <Typo className="text-brand-900 font-sans-bold text-base">
              {isLoading ? "Updating..." : "Update Password"}
            </Typo>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ChangePassword;
