// import React, { useMemo } from "react";
// import { View, Dimensions } from "react-native";
// import Carousel from "react-native-reanimated-carousel";
// import Animated, {
//   useAnimatedStyle,
//   interpolate,
//   Extrapolation,
//   useSharedValue,
//   SharedValue,
// } from "react-native-reanimated";
// import { colors } from "@/src/constants/colors";
// import { AssetSummaryCard, MonthlyStatusCard } from "../cards";
// import {
//   useDigitalAssetsPortfolio,
//   useEquityPortfolioSummary,
//   useMonthlyExpenseSummary,
//   useMonthlyIncome,
// } from "@/src/hooks";

// interface BudgetData {
//   month: string;
//   salary: number;
//   expenses: number;
//   remaining: number;
// }

// interface AssetData {
//   totalAssets: number;
//   gold: number;
//   silver: number;
//   equity: number;
// }

// type CarouselItem =
//   | { type: "budget"; data: BudgetData }
//   | { type: "assets"; data: AssetData };

// const width = Dimensions.get("window").width;

// // --- Separate Component for Animated Dot ---
// const PaginationDot = ({
//   index,
//   animValue,
// }: {
//   index: number;
//   animValue: SharedValue<number>;
// }) => {
//   const animatedStyle = useAnimatedStyle(() => {
//     const dotWidth = interpolate(
//       animValue.value,
//       [index - 1, index, index + 1],
//       [6, 16, 6],
//       Extrapolation.CLAMP,
//     );

//     const opacity = interpolate(
//       animValue.value,
//       [index - 1, index, index + 1],
//       [0.2, 1, 0.2],
//       Extrapolation.CLAMP,
//     );

//     return {
//       width: dotWidth,
//       opacity,
//     };
//   });

//   return (
//     <Animated.View
//       style={[
//         {
//           height: 6,
//           borderRadius: 3,
//           backgroundColor: colors.success[500],
//         },
//         animatedStyle,
//       ]}
//     />
//   );
// };

// const DashboardCarousel = () => {
//   const progressValue = useSharedValue<number>(0);

//   const { income } = useMonthlyIncome();
//   const { summary } = useMonthlyExpenseSummary();
//   const { goldSummary, silverSummary } = useDigitalAssetsPortfolio();
//   const { summary: equitySummary } = useEquityPortfolioSummary();

//   const totalSalary = income?.totalIncome || 0;
//   const totalExpenses = summary?.grandTotal || 0;

//   const goldVal = goldSummary?.totalValue || 0;
//   const silverVal = silverSummary?.totalValue || 0;
//   const equityVal = equitySummary?.totalInvestment || 0;

//   const carouselItems = useMemo<CarouselItem[]>(
//     () => [
//       {
//         type: "budget",
//         data: {
//           month:
//             income?.month ||
//             new Date().toLocaleString("default", {
//               month: "long",
//               year: "numeric",
//             }),
//           salary: totalSalary,
//           expenses: totalExpenses,
//           remaining: totalSalary - totalExpenses,
//         },
//       },
//       {
//         type: "assets",
//         data: {
//           totalAssets: goldVal + silverVal + equityVal,
//           gold: goldVal,
//           silver: silverVal,
//           equity: equityVal,
//         },
//       },
//     ],
//     [income, totalSalary, totalExpenses, goldVal, silverVal, equityVal],
//   );

//   return (
//     <View className="items-center mb-6">
//       <Carousel
//         width={width}
//         height={220}
//         autoPlay={false}
//         data={carouselItems}
//         onProgressChange={(_, absoluteProgress) =>
//           (progressValue.value = absoluteProgress)
//         }
//         mode="parallax"
//         modeConfig={{
//           parallaxScrollingScale: 0.92,
//           parallaxScrollingOffset: 50,
//         }}
//         renderItem={({ item }) => {
//           if (item.type === "budget") {
//             return (
//               <View className="px-4">
//                 <MonthlyStatusCard monthlyStats={item.data as BudgetData} />
//               </View>
//             );
//           }

//           if (item.type === "assets") {
//             return (
//               <View className="px-4">
//                 <AssetSummaryCard assetStats={item.data as AssetData} />
//               </View>
//             );
//           }

//           return <View />;
//         }}
//       />

//       <View className="flex-row gap-x-2 -mt-12 items-center justify-center">
//         {carouselItems.map((_, index) => (
//           <PaginationDot key={index} index={index} animValue={progressValue} />
//         ))}
//       </View>
//     </View>
//   );
// };

// export default DashboardCarousel;


// import React, { useMemo } from "react";
// import { View, Dimensions } from "react-native";
// import Carousel from "react-native-reanimated-carousel";
// import Animated, {
//   useAnimatedStyle,
//   interpolate,
//   Extrapolation,
//   useSharedValue,
//   SharedValue,
// } from "react-native-reanimated";
// import { colors } from "@/src/constants/colors";
// import { AssetSummaryCard, MonthlyStatusCard } from "../cards";
// import {
//   useDigitalAssetsPortfolio,
//   useEquityPortfolioSummary,
//   useMonthlyExpenseSummary,
//   useMonthlyIncome,
// } from "@/src/hooks";

// interface BudgetData {
//   month: string;
//   salary: number;
//   expenses: number;
//   remaining: number;
// }

// interface AssetData {
//   totalAssets: number;
//   gold: number;
//   silver: number;
//   equity: number;
// }

// type CarouselItem =
//   | { type: "budget"; data: BudgetData }
//   | { type: "assets"; data: AssetData };

// const width = Dimensions.get("window").width;

// // --- Separate Component for Animated Dot ---
// const PaginationDot = ({
//   index,
//   animValue,
// }: {
//   index: number;
//   animValue: SharedValue<number>;
// }) => {
//   const animatedStyle = useAnimatedStyle(() => {
//     const dotWidth = interpolate(
//       animValue.value,
//       [index - 1, index, index + 1],
//       [6, 16, 6],
//       Extrapolation.CLAMP,
//     );

//     const opacity = interpolate(
//       animValue.value,
//       [index - 1, index, index + 1],
//       [0.2, 1, 0.2],
//       Extrapolation.CLAMP,
//     );

//     return {
//       width: dotWidth,
//       opacity,
//     };
//   });

//   return (
//     <Animated.View
//       style={[
//         {
//           height: 6,
//           borderRadius: 3,
//           backgroundColor: colors.success[500],
//         },
//         animatedStyle,
//       ]}
//     />
//   );
// };

// const DashboardCarousel = () => {
//   const progressValue = useSharedValue<number>(0);

//   // Generate current month key for dashboard (always current month)
//   // Use useMemo to prevent recalculation on every render
//   const currentMonthKey = useMemo(() => {
//     const currentDate = new Date();
//     return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
//   }, []);

//   const { income } = useMonthlyIncome(currentMonthKey);
//   const { summary } = useMonthlyExpenseSummary(currentMonthKey);
//   const { goldSummary, silverSummary } = useDigitalAssetsPortfolio();
//   const { summary: equitySummary } = useEquityPortfolioSummary();

//   const totalSalary = income?.totalIncome || 0;
//   const totalExpenses = summary?.grandTotal || 0;

//   const goldVal = goldSummary?.totalValue || 0;
//   const silverVal = silverSummary?.totalValue || 0;
//   const equityVal = equitySummary?.totalInvestment || 0;

//   const carouselItems = useMemo<CarouselItem[]>(
//     () => [
//       {
//         type: "budget",
//         data: {
//           month: currentMonthKey,
//           salary: totalSalary,
//           expenses: totalExpenses,
//           remaining: totalSalary - totalExpenses,
//         },
//       },
//       {
//         type: "assets",
//         data: {
//           totalAssets: goldVal + silverVal + equityVal,
//           gold: goldVal,
//           silver: silverVal,
//           equity: equityVal,
//         },
//       },
//     ],
//     [currentMonthKey, totalSalary, totalExpenses, goldVal, silverVal, equityVal],
//   );

//   return (
//     <View className="items-center mb-6">
//       <Carousel
//         width={width}
//         height={220}
//         autoPlay={false}
//         data={carouselItems}
//         onProgressChange={(_, absoluteProgress) =>
//           (progressValue.value = absoluteProgress)
//         }
//         mode="parallax"
//         modeConfig={{
//           parallaxScrollingScale: 0.92,
//           parallaxScrollingOffset: 50,
//         }}
//         renderItem={({ item }) => {
//           if (item.type === "budget") {
//             return (
//               <View className="px-4">
//                 <MonthlyStatusCard monthlyStats={item.data as BudgetData} />
//               </View>
//             );
//           }

//           if (item.type === "assets") {
//             return (
//               <View className="px-4">
//                 <AssetSummaryCard assetStats={item.data as AssetData} />
//               </View>
//             );
//           }

//           return <View />;
//         }}
//       />

//       <View className="flex-row gap-x-2 -mt-12 items-center justify-center">
//         {carouselItems.map((_, index) => (
//           <PaginationDot key={index} index={index} animValue={progressValue} />
//         ))}
//       </View>
//     </View>
//   );
// };

// export default DashboardCarousel;


import React, { useMemo } from "react";
import { View, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useSharedValue,
  SharedValue,
} from "react-native-reanimated";
import { colors } from "@/src/constants/colors";
import { AssetSummaryCard, MonthlyStatusCard } from "../cards";
import {
  useDigitalAssetsPortfolio,
  useEquityPortfolioSummary,
  useMonthlyExpenseSummary,
  useMonthlyIncome,
} from "@/src/hooks";

interface BudgetData {
  month: string;
  salary: number;
  expenses: number;
  remaining: number;
}

interface AssetData {
  totalAssets: number;
  gold: number;
  silver: number;
  equity: number;
}

type CarouselItem =
  | { type: "budget"; data: BudgetData }
  | { type: "assets"; data: AssetData };

const width = Dimensions.get("window").width;

// --- Separate Component for Animated Dot ---
const PaginationDot = ({
  index,
  animValue,
}: {
  index: number;
  animValue: SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const dotWidth = interpolate(
      animValue.value,
      [index - 1, index, index + 1],
      [6, 16, 6],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      animValue.value,
      [index - 1, index, index + 1],
      [0.2, 1, 0.2],
      Extrapolation.CLAMP,
    );

    return {
      width: dotWidth,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.success[500],
        },
        animatedStyle,
      ]}
    />
  );
};

const DashboardCarousel = () => {
  const progressValue = useSharedValue<number>(0);

  // Generate current month key for dashboard (always current month)
  // Use useMemo to prevent recalculation on every render
  const currentMonthKey = useMemo(() => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const { income } = useMonthlyIncome(currentMonthKey);
  const { summary } = useMonthlyExpenseSummary(currentMonthKey);
  const { goldSummary, silverSummary } = useDigitalAssetsPortfolio();
  const { summary: equitySummary } = useEquityPortfolioSummary();

  const totalSalary = income?.totalIncome || 0;
  const totalExpenses = summary?.grandTotal || 0;

  const goldVal = goldSummary?.totalValue || 0;
  const silverVal = silverSummary?.totalValue || 0;
  const equityVal = equitySummary?.totalInvestment || 0;

  const carouselItems = useMemo<CarouselItem[]>(
    () => [
      {
        type: "budget",
        data: {
          month: currentMonthKey,
          salary: totalSalary,
          expenses: totalExpenses,
          remaining: totalSalary - totalExpenses,
        },
      },
      {
        type: "assets",
        data: {
          totalAssets: goldVal + silverVal + equityVal,
          gold: goldVal,
          silver: silverVal,
          equity: equityVal,
        },
      },
    ],
    [currentMonthKey, totalSalary, totalExpenses, goldVal, silverVal, equityVal],
  );

  return (
    <View className="items-center mb-6">
      <Carousel
        width={width}
        height={220}
        autoPlay={false}
        data={carouselItems}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.92,
          parallaxScrollingOffset: 50,
        }}
        renderItem={({ item }) => {
          if (item.type === "budget") {
            return (
              <View className="px-4">
                <MonthlyStatusCard monthlyStats={item.data as BudgetData} />
              </View>
            );
          }

          if (item.type === "assets") {
            return (
              <View className="px-4">
                <AssetSummaryCard assetStats={item.data as AssetData} />
              </View>
            );
          }

          return <View />;
        }}
      />

      <View className="flex-row gap-x-2 -mt-12 items-center justify-center">
        {carouselItems.map((_, index) => (
          <PaginationDot key={index} index={index} animValue={progressValue} />
        ))}
      </View>
    </View>
  );
};

export default DashboardCarousel;