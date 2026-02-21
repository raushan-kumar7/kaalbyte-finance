import React from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { colors } from "@/src/constants/colors";
import { Typo } from "../ui";

interface WeeklyBarChartProps {
  weeklyData: {
    date: Date;
    total: number;
  }[];
}

const WeeklyBarChart = ({ weeklyData }: WeeklyBarChartProps) => {
  const data = weeklyData.map((day) => ({
    value: day.total,
    label: day.date.toLocaleDateString("en-US", { weekday: "narrow" }), // M, T, W, etc.
    frontColor: day.total > 0 ? colors.brand[500] : colors.brand[900],
  }));

  // Find the max value to highlight
  const maxValue = Math.max(...data.map((d) => d.value));

  // Highlight the day with max spending
  const dataWithHighlight = data.map((item) => ({
    ...item,
    frontColor:
      item.value === maxValue && maxValue > 0
        ? colors.gold[500]
        : item.frontColor,
  }));

  return (
    <View
      className="bg-brand-800 rounded-[32px] p-5 border border-white/5 items-center"
      style={{ overflow: "visible" }}
    >
      <View style={{ overflow: "visible", paddingTop: 50, marginTop: -50 }}>
        <BarChart
          data={dataWithHighlight}
          barWidth={16}
          spacing={22}
          roundedTop
          noOfSections={3}
          yAxisThickness={0}
          xAxisThickness={0}
          hideRules
          height={150}
          // --- INTERACTION ---
          focusBarOnPress
          activeOpacity={0.7}
          disableScroll
          renderTooltip={(item: any) => (
            <View
              style={{
                backgroundColor: colors.white,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
                borderWidth: 1,
                borderColor: `${colors.gold[500]}33`,
                marginBottom: -25,
              }}
            >
              <Typo className="text-brand-900 text-[11px] font-mono-bold">
                ₹{item.value.toLocaleString()}
              </Typo>
            </View>
          )}
          leftShiftForTooltip={10}
          leftShiftForLastIndexTooltip={20}
          // --- STYLING ---
          yAxisTextStyle={{
            color: colors.text.muted,
            fontSize: 9,
            fontFamily: "FiraCode-Regular",
          }}
          xAxisLabelTextStyle={{
            color: colors.text.muted,
            fontSize: 9,
            fontFamily: "FiraCode-Regular",
          }}
        />
      </View>
    </View>
  );
};
export default WeeklyBarChart;
