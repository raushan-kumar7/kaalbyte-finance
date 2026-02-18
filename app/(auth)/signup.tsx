import {
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView
} from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Lock, Mail, UserCheck } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { ISignup, signupSchema } from "@/src/validations/auth";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";
import { Button, Footer, Input, ScreenWrapper, Typo } from "@/src/components";

const Signup = () => {
  const router = useRouter();
  const { signup, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISignup>({
    resolver: yupResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: ISignup) => {
    // console.log("Signup Data: " , data);
    try {
      await signup(data);
      router.replace("/(tabs)");
      reset();
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <ScreenWrapper className="font-mono">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 px-6 pt-4 pb-8">
            {/* Header */}
            <View className="items-center mb-8">
              <Image
                source={require("@/assets/images/logo.png")}
                className="w-24 h-24"
                resizeMode="contain"
              />
              <Typo className="text-3xl font-mono-bold text-white mt-2">
                Create Account
              </Typo>
              <Typo className="text-text-secondary font-mono opacity-70">
                Enter your details to join the vault
              </Typo>
            </View>

            <View className="gap-4">
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="First Name"
                        placeholder="John"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.firstName?.message}
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Last Name"
                        placeholder="Doe"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.lastName?.message}
                      />
                    )}
                  />
                </View>
              </View>
            </View>

            <View className="gap-4 mt-3">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    placeholder="example@kaalbyte.com"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    leftIcon={<Mail size={18} color={colors.text.secondary} />}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Username"
                    placeholder="kaalbyte_finance"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    leftIcon={
                      <UserCheck size={18} color={colors.text.secondary} />
                    }
                    error={errors.username?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="••••••••"
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

            {/* Submit & Footer */}
            <View className="mt-10 gap-6">
              <Button
                title="Create Account"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                className="bg-gold-500 h-16 rounded-2xl"
              />

              <View className="flex-row justify-center items-center gap-2">
                <Typo className="text-text-secondary font-mono">
                  Already have an account?
                </Typo>
                <TouchableOpacity onPress={() => router.back()}>
                  <Typo className="text-gold-500 font-mono-bold underline">
                    Sign In
                  </Typo>
                </TouchableOpacity>
              </View>

              <Footer />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Signup;
