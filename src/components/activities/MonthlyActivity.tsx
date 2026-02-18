import React from "react";
import { View } from "react-native";
import { MonthlyDistribution, MonthlyGrowthTrend } from "../charts";

const MonthlyActivity = () => (
  <View className="gap-y-6">
    <MonthlyDistribution />
    <MonthlyGrowthTrend />
  </View>
);

export default MonthlyActivity;