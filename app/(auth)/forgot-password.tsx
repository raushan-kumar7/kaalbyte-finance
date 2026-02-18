import {
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Mail, ArrowLeft} from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";
import { Button, Footer, Input, ScreenWrapper, Typo } from "@/src/components";

const ForgotPassword = () => {
  const router = useRouter();
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleReset = async () => {
    if (!email) return;
    const success = await forgotPassword(email);
    if (success) {
      setIsSubmitted(true);
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
          <View className="flex-1 px-6 justify-between pb-8">
            {/* Top Section */}
            <View className="pt-8">
              <TouchableOpacity 
                onPress={() => router.back()}
                className="flex-row items-center gap-2 mb-6"
              >
                <ArrowLeft size={20} color={colors.gold[500]} />
                <Typo className="text-gold-500 font-mono-bold">Back</Typo>
              </TouchableOpacity>

              <View className="items-center">
                <View className="w-32 h-32">
                  <Image
                    source={require("@/assets/images/logo.png")}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>
                
                <View className="items-center px-4 mt-2">
                  <Typo className="text-3xl font-mono-semibold text-white tracking-tight text-center">
                    {isSubmitted ? "Link Sent" : "Reset Password"}
                  </Typo>
                  <Typo className="text-base font-mono text-text-secondary text-center mt-2 opacity-80">
                    {isSubmitted 
                      ? "Check your inbox for instructions to unlock your vault access." 
                      : "Enter your registered email to receive a password reset link."}
                  </Typo>
                </View>
              </View>
            </View>

            {/* Form Section */}
            <View className="gap-6 mt-1">
              {!isSubmitted ? (
                <Input
                  label="Email Address"
                  placeholder="vault.holder@example.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  leftIcon={<Mail size={18} color={colors.text.secondary} />}
                />
              ) : (
                <View className="bg-gold-500/10 border border-gold-500/20 p-4 rounded-2xl">
                  <Typo className="text-gold-500 text-center font-mono text-sm">
                    A secure link has been dispatched to:{"\n"}
                    <Typo className="font-mono-bold text-white">{email}</Typo>
                  </Typo>
                </View>
              )}
            </View>

            {/* Action Section */}
            <View className="gap-8 mt-10">
              <Button
                title={isSubmitted ? "Resend Link" : "Send Reset Link"}
                onPress={handleReset}
                loading={isLoading}
                className="bg-gold-500 h-16 rounded-2xl"
              />

              {!isSubmitted && (
                <View className="flex-row justify-center items-center gap-2">
                  <Typo className="text-text-secondary font-mono">
                    Remembered it?
                  </Typo>
                  <TouchableOpacity onPress={() => router.back()}>
                    <Typo className="text-gold-500 font-mono-bold underline">
                      Sign In
                    </Typo>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View className="mt-4">
              <Footer />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default ForgotPassword;