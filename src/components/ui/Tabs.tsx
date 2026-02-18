// import React, { JSX, useEffect } from "react";
// import { TouchableOpacity, View } from "react-native";
// import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
// import { Home, Wallet, History, User, Plus } from "lucide-react-native";
// import * as Haptics from "expo-haptics";
// import { colors } from "@/src/constants/colors";
// import Animated, {
//   useAnimatedStyle,
//   withSpring,
//   useSharedValue,
//   withSequence,
//   withTiming,
// } from "react-native-reanimated";
// import Typo from "./Typo";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// const TabItem = ({
//   route,
//   isActive,
//   onPress,
//   label,
// }: {
//   route: any;
//   isActive: boolean;
//   onPress: () => void;
//   label: string;
// }) => {
//   const scale = useSharedValue(1);
//   const opacity = useSharedValue(0.6);
//   const translateY = useSharedValue(0);

//   useEffect(() => {
//     scale.value = withSpring(isActive ? 1 : 1, {
//       damping: 12,
//       stiffness: 150,
//     });
//     opacity.value = withTiming(isActive ? 1 : 0.5, {
//       duration: 200,
//     });
//     translateY.value = withSpring(isActive ? -2 : 0, {
//       damping: 10,
//       stiffness: 100,
//     });
//   }, [isActive, scale, opacity, translateY]);

//   const animatedIconStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }, { translateY: translateY.value }],
//     opacity: opacity.value,
//   }));

//   const getIcon = (routeName: string, color: string, active: boolean) => {
//     const iconSize = 24;
//     const strokeWidth = active ? 2.5 : 2;

//     const icons: Record<string, JSX.Element> = {
//       index: <Home size={iconSize} color={color} strokeWidth={strokeWidth} />,
//       assets: (
//         <Wallet size={iconSize} color={color} strokeWidth={strokeWidth} />
//       ),
//       history: (
//         <History size={iconSize} color={color} strokeWidth={strokeWidth} />
//       ),
//       profile: <User size={iconSize} color={color} strokeWidth={strokeWidth} />,
//     };

//     return icons[routeName] || <Home size={iconSize} color={color} />;
//   };

//   const iconColor = isActive ? colors.gold[500] : colors.text.secondary;

//   const handlePress = () => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//     onPress();
//   };

//   return (
//     <TouchableOpacity
//       onPress={handlePress}
//       activeOpacity={0.7}
//       className="flex-1 items-center justify-center py-5"
//     >
//       <View className="items-center gap-1">
//         <Animated.View style={animatedIconStyle}>
//           {getIcon(route.name, iconColor, isActive)}
//         </Animated.View>

//         <Typo
//           className={`text-xs font-sans-medium ${
//             isActive ? "text-gold-500" : "text-text-secondary"
//           }`}
//         >
//           {label}
//         </Typo>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const CenterActionButton = ({ onPress }: { onPress: () => void }) => {
//   const scale = useSharedValue(1);
//   const rotate = useSharedValue(0);
//   const glowOpacity = useSharedValue(0.3);

//   const animatedButtonStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
//   }));

//   const animatedGlowStyle = useAnimatedStyle(() => ({
//     opacity: glowOpacity.value,
//   }));

//   const handlePress = () => {
//     scale.value = withSequence(
//       withSpring(0.88, { damping: 10 }),
//       withSpring(1.08, { damping: 8 }),
//       withSpring(1, { damping: 10 }),
//     );
//     rotate.value = withSequence(
//       withTiming(90, { duration: 150 }),
//       withTiming(0, { duration: 150 }),
//     );
//     glowOpacity.value = withSequence(
//       withTiming(0.6, { duration: 150 }),
//       withTiming(0.3, { duration: 300 }),
//     );
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//     onPress();
//   };

//   return (
//     <View className="items-center justify-center -mt-1">
//       {/* Glow effect */}
//       <Animated.View
//         style={animatedGlowStyle}
//         className="absolute w-16 h-16 rounded-full bg-gold-500 blur-xl"
//       />

//       {/* Main button */}
//       <TouchableOpacity
//         onPress={handlePress}
//         activeOpacity={0.9}
//         className="items-center"
//       >
//         <Animated.View
//           style={animatedButtonStyle}
//           className="w-14 h-14 rounded-full bg-gold-500 items-center justify-center"
//         >
//           <View className="absolute inset-0 rounded-full border border-gold-600/30" />
//           <Plus size={28} color={colors.text.inverse} strokeWidth={2.5} />
//         </Animated.View>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const CustomTabBar = ({
//   state,
//   navigation,
//   descriptors,
// }: BottomTabBarProps) => {
//   const insets = useSafeAreaInsets();
//   const handleNewLog = () => {
//     navigation.navigate("index", { openMenu: true });
//   };

//   return (
//     <View
//       className="absolute bottom-0 left-0 right-0"
//       style={{ paddingBottom: insets.bottom > 0 ? insets.bottom - 10 : 15 }}
//     >
//       {/* Background with blur effect */}
//       <View className="bg-ui-card border-t border-ui-border">
//         <View className="flex-row items-center px-2">
//           {/* Left tabs */}
//           {state.routes.slice(0, 2).map((route, index) => {
//             const { options } = descriptors[route.key];
//             const label =
//               options.title !== undefined ? options.title : route.name;
//             const isActive = state.index === index;

//             const onPress = () => {
//               const event = navigation.emit({
//                 type: "tabPress",
//                 target: route.key,
//                 canPreventDefault: true,
//               });

//               if (!isActive && !event.defaultPrevented) {
//                 navigation.navigate(route.name);
//               }
//             };

//             return (
//               <TabItem
//                 key={route.key}
//                 route={route}
//                 isActive={isActive}
//                 onPress={onPress}
//                 label={label}
//               />
//             );
//           })}

//           {/* Center button spacer */}
//           <View className="w-20" />

//           {/* Right tabs */}
//           {state.routes.slice(2).map((route, index) => {
//             const actualIndex = index + 2;
//             const { options } = descriptors[route.key];
//             const label =
//               options.title !== undefined ? options.title : route.name;
//             const isActive = state.index === actualIndex;

//             const onPress = () => {
//               const event = navigation.emit({
//                 type: "tabPress",
//                 target: route.key,
//                 canPreventDefault: true,
//               });

//               if (!isActive && !event.defaultPrevented) {
//                 navigation.navigate(route.name);
//               }
//             };

//             return (
//               <TabItem
//                 key={route.key}
//                 route={route}
//                 isActive={isActive}
//                 onPress={onPress}
//                 label={label}
//               />
//             );
//           })}
//         </View>
//       </View>

//       {/* Center action button positioned absolutely */}
//       <View
//         className="absolute left-0 right-0 items-center"
//         style={{ top: -4 }}
//       >
//         <CenterActionButton onPress={handleNewLog} />
//       </View>
//     </View>
//   );
// };

// export default CustomTabBar;

import React, { JSX, useEffect } from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Home, Wallet, History, User, Plus } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { colors } from "@/src/constants/colors";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Typo from "./Typo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TabItem = ({ route, isActive, onPress, label }: any) => {
  const opacity = useSharedValue(isActive ? 1 : 0.5);

  useEffect(() => {
    opacity.value = withTiming(isActive ? 1 : 0.5, { duration: 200 });
  }, [isActive, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const getIcon = (routeName: string, color: string) => {
    const iconSize = 22;
    const icons: Record<string, JSX.Element> = {
      index: <Home size={iconSize} color={color} />,
      assets: <Wallet size={iconSize} color={color} />,
      history: <History size={iconSize} color={color} />,
      profile: <User size={iconSize} color={color} />,
    };
    return icons[routeName] || <Home size={iconSize} color={color} />;
  };

  return (
    <TouchableOpacity 
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }} 
      className="flex-1 items-center justify-center pt-2"
    >
      <Animated.View style={animatedStyle} className="items-center">
        {getIcon(route.name, isActive ? colors.gold[500] : colors.text.secondary)}
        <Typo className={`text-[10px] mt-1 uppercase tracking-tighter ${isActive ? "text-gold-500 font-sans-bold" : "text-text-secondary"}`}>
          {label}
        </Typo>
      </Animated.View>
    </TouchableOpacity>
  );
};

const CustomTabBar = ({ state, navigation, descriptors }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  
  // --- SVG PATH CONFIGURATION ---
  const tabWidth = SCREEN_WIDTH;
  const notchWidth = 58; // The width of the dip
  const notchDepth = 48; // How deep it curves in
  const cornerRadius = 30; // Smoothness of the edges

  // This Path draws the specific "U" shape notch from your sketch
  const d = `
    M0,0 
    L${(tabWidth - notchWidth) / 2 - cornerRadius},0 
    Q${(tabWidth - notchWidth) / 2},0 ${(tabWidth - notchWidth) / 2},${cornerRadius}
    L${(tabWidth - notchWidth) / 2},${notchDepth - cornerRadius}
    Q${(tabWidth - notchWidth) / 2},${notchDepth} ${(tabWidth - notchWidth) / 2 + cornerRadius},${notchDepth}
    L${(tabWidth + notchWidth) / 2 - cornerRadius},${notchDepth}
    Q${(tabWidth + notchWidth) / 2},${notchDepth} ${(tabWidth + notchWidth) / 2},${notchDepth - cornerRadius}
    L${(tabWidth + notchWidth) / 2},${cornerRadius}
    Q${(tabWidth + notchWidth) / 2},0 ${(tabWidth + notchWidth) / 2 + cornerRadius},0
    L${tabWidth},0 
    L${tabWidth},100 
    L0,100 
    Z
  `;

  return (
    <View className="absolute bottom-0 left-0 right-0" style={{ height: 70 + insets.bottom }}>
      {/* Background Notch Shape */}
      <View className="absolute inset-0">
        <Svg width={tabWidth} height={100 + insets.bottom}>
          <Path
            d={d}
            fill={colors.brand[800]} // Matches your UI card color
            stroke={colors.white + "08"} // Subtle top border
            strokeWidth={1}
          />
        </Svg>
      </View>

      <View className="flex-row items-center h-[80px] px-2">
        {/* Left Side: Home & Assets */}
        {state.routes.slice(0, 2).map((route, index) => (
          <TabItem
            key={route.key}
            route={route}
            isActive={state.index === index}
            label={descriptors[route.key].options.title || route.name}
            onPress={() => navigation.navigate(route.name)}
          />
        ))}

        {/* Center: The Floating Plus Button */}
        <View className="w-20 items-center justify-center mb-2">
          <View style={{ top: -18 }}>
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => navigation.navigate("index", { openMenu: true })}
              className="w-14 h-14 rounded-full bg-gold-500 items-center justify-center shadow-2xl shadow-gold-500/40"
            >
              <Plus size={32} color={colors.brand[900]} strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Side: History & Profile */}
        {state.routes.slice(2).map((route, index) => (
          <TabItem
            key={route.key}
            route={route}
            isActive={state.index === index + 2}
            label={descriptors[route.key].options.title || route.name}
            onPress={() => navigation.navigate(route.name)}
          />
        ))}
      </View>
    </View>
  );
};

export default CustomTabBar;