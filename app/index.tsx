import React from "react";
import { View, Image } from "react-native";
import { Banner, Button, Footer, ScreenWrapper, Typo } from "@/src/components";
import { TrendingUp } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <View className="flex-1 px-6 justify-between">
        {/** Header Section */}
        <View className="pt-8">
          {/** Logo */}
          <View className="justify-center items-center">
            <View className="w-44 h-44">
              <Image
                source={require("@/assets/images/logo.png")}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </View>

          {/** Hero Text */}
          <View className="items-center px-4 -mt-8">
            <Typo className="text-5xl font-serif text-white tracking-tight text-center leading-[58px]">
              Your Wealth,
            </Typo>
            <Typo className="text-5xl text-gold-500 font-serif-bold text-center mb-5">
              Defined.
            </Typo>

            {/* <View className="h-1 w-20 bg-gold-500 my-5 rounded-full" /> */}
            <View className="-mt-1 px-2 py-2 bottom-2">
              <TrendingUp className="" size={38} color={colors.gold[500]} />
            </View>

            {/** Subtitle */}
            <Typo className="-mt-2 text-base font-mono text-text-secondary text-center leading-6 opacity-85 px-2">
              Take control of your financial future. Track{" "}
              <Typo className="underline  decoration-gold-500 underline-offset-2">
                expenses
              </Typo>
              , <Typo className="underline">income</Typo>, and{" "}
              <Typo className="underline">assets</Typo> seamlessly.
            </Typo>
          </View>
        </View>

        {/** Footer Section */}
        <View className="pb-10">
          <View className="-top-2">
            <Banner />
          </View>

          {/** CTA Button */}
          <Button
            title="Get Started"
            variant="outline"
            className="mb-6"
            onPress={() => router.push("/(auth)/signin")}
          />

          {/** Copyright */}
          <Footer />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Index;
