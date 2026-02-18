import {
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Lock, User } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { ISignin, signinSchema } from "@/src/validations/auth";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";
import { Button, Footer, Input, ScreenWrapper, Typo } from "@/src/components";

const Signin = () => {
  const router = useRouter();
  const { signin, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISignin>({
    resolver: yupResolver(signinSchema),
    mode: "onTouched",
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const onSubmit = async (data: ISignin) => {
    try {
      await signin(data);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
    }
    reset();
  };

  return (
    <ScreenWrapper className="font-mono">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-between pb-8">
          {/* Top Section: Branding */}
          <View className="items-center pt-8">
            <View className="justify-center items-center">
              <View className="w-40 h-40">
                <Image
                  source={require("@/assets/images/logo.png")}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
            </View>

            <View className="items-center px-4 -mt-4">
              <Typo className="text-4xl font-mono-semibold text-white tracking-tight text-center">
                Sign In
              </Typo>
              <Typo className="text-base font-mono text-text-secondary text-center mt-2 opacity-80">
                Please enter credentials to access your account
              </Typo>
            </View>
          </View>

          {/* Middle Section: Form Fields */}
          <View className="gap-6 mt-1">
            <Controller
              control={control}
              name="userId"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="User ID"
                  placeholder="Username or email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  leftIcon={<User size={18} color={colors.text.secondary} />}
                  error={errors.userId?.message}
                />
              )}
            />

            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="Password"
                    isPassword
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    leftIcon={<Lock size={18} color={colors.text.secondary} />}
                    error={errors.password?.message}
                  />
                )}
              />
            </View>

            <TouchableOpacity
              className="self-end mt-1"
              onPress={() => router.push("/(auth)/forgot-password")}
            >
              <Typo className="text-gold-500 text-sm font-mono-semibold uppercase tracking-widest">
                Forgot Password?
              </Typo>
            </TouchableOpacity>
          </View>

          <View className="gap-8 mt-5">
            <Button
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              className="bg-gold-500 h-16 rounded-2xl"
            />

            <View className="flex-row justify-center items-center gap-2">
              <Typo className="text-text-secondary font-mono">
                New to the vault?
              </Typo>
              <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Typo className="text-gold-500 font-mono-bold underline">
                  Join Now
                </Typo>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Section: Actions */}
          <View className="gap-6 -mt-2">
            <Footer />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Signin;
