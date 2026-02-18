// import { View, StatusBar } from "react-native";
// import React from "react";
// import { cn } from "@/src/utils/cn";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// interface ScreenWrapperProps {
//   children: React.ReactNode;
//   className?: string;
//   bg?: string;
//   withBottomInset?: boolean;
// }

// const ScreenWrapper = ({
//   children,
//   className = "",
//   bg,
//   withBottomInset = false,
// }: ScreenWrapperProps) => {
//   const insets = useSafeAreaInsets();

//   return (
//     <View
//       style={{
//         flex: 1,
//         paddingTop: insets.top,
//         // Using bottom inset is crucial for devices with home indicators (iPhone 13+, etc)
//         paddingBottom: withBottomInset ? insets.bottom : 0,
//       }}
//       // If bg prop is provided, use it; otherwise, default to ui-background
//       className={cn(bg ? bg : "bg-ui-background", className)}
//     >
//       {/* Since your theme is primarily #010528 (Deep Navy), 
//           'light-content' is almost always the right choice.
//       */}
//       <StatusBar 
//         barStyle="light-content" 
//         backgroundColor="transparent" 
//         translucent 
//       />
//       {children}
//     </View>
//   );
// };

// export default ScreenWrapper;

import { View, StatusBar } from "react-native";
import React from "react";
import { cn } from "@/src/utils/cn";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  className?: string;
  bg?: string;
  withBottomInset?: boolean;
}

const ScreenWrapper = ({
  children,
  className = "",
  bg,
  withBottomInset = false,
}: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        // If the screen is a sub-page (not a tab), withBottomInset={true} is vital.
        // If it's a main Tab screen, the TabBar handles its own insets.
        paddingBottom: withBottomInset ? insets.bottom : 0,
      }}
      className={cn(bg ? bg : "bg-ui-background", className)}
    >
      {/* On Android, the StatusBar can sometimes look "detached" from the app 
          if the backgroundColor isn't explicit or translucent isn't handled.
      */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent 
      />
      
      {/* Using a flex-1 View wrapper for children ensures that 
          scrolling components inside ScreenWrapper fill the height.
      */}
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </View>
  );
};

export default ScreenWrapper;