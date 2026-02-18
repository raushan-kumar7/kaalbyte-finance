// import React, { useEffect } from "react";
// import { View, ActivityIndicator } from "react-native";
// import { useRouter, useSegments } from "expo-router";
// import { useAuthStore } from "@/src/stores/useAuthStore";
// import { colors } from "@/src/constants/colors";

// interface AuthGuardProps {
//   children: React.ReactNode;
//   isInitializing: boolean;
// }

// const AuthGuard = ({ children, isInitializing }: AuthGuardProps) => {
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
//   const hasSeenLanding = useAuthStore((state) => state.hasSeenLanding);
//   const segments = useSegments();
//   const router = useRouter();

//   useEffect(() => {
//     // Don't apply navigation logic while still initializing auth
//     if (isInitializing) return;

//     const firstSegment = segments[0];

//     // Check route types
//     const isPublicRoute = (segments as string[]).length === 0; // Empty segments means index page
//     const isAuthRoute = firstSegment === "(auth)";
//     const isProtectedRoute = firstSegment === "(tabs)";

//     // Navigation logic with early returns for better performance
//     if (isProtectedRoute && !isAuthenticated) {
//       // Unauthenticated user trying to access protected route
//       router.replace("/(auth)/signin");
//       return;
//     }

//     if (isAuthRoute && isAuthenticated) {
//       // Authenticated user trying to access auth screens
//       router.replace("/(tabs)");
//       return;
//     }

//     if (isPublicRoute && hasSeenLanding && !isAuthenticated) {
//       // User has seen landing, redirect to signin
//       router.replace("/(auth)/signin");
//       return;
//     }

//     if (!isPublicRoute && !isAuthRoute && !isAuthenticated) {
//       // Unauthenticated user on unknown route
//       router.replace("/(auth)/signin");
//     }
//   }, [isAuthenticated, isInitializing, segments, router, hasSeenLanding]);

//   // Show loading screen during initialization
//   if (isInitializing) {
//     return (
//       <View className="flex-1 bg-ui-background items-center justify-center">
//         <ActivityIndicator size="large" color={colors.gold[500]} />
//       </View>
//     );
//   }

//   return <>{children}</>;
// };

// export default AuthGuard;


import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { colors } from "@/src/constants/colors";

interface AuthGuardProps {
  children: React.ReactNode;
  isInitializing: boolean;
}

const AuthGuard = ({ children, isInitializing }: AuthGuardProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasSeenLanding = useAuthStore((state) => state.hasSeenLanding);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isInitializing) return;

    const firstSegment = segments[0];

    const isLandingPage = (segments as string[]).length === 0;
    const isAuthRoute = firstSegment === "(auth)";
    const isProtectedRoute = firstSegment === "(tabs)";

    // 1. Authenticated user — send to app, skip landing & auth screens
    if (isAuthenticated) {
      if (isLandingPage || isAuthRoute) {
        router.replace("/(tabs)");
      }
      return;
    }

    // 2. Unauthenticated user who has already seen the landing page
    //    — skip landing, go straight to signin
    if (hasSeenLanding && isLandingPage) {
      router.replace("/(auth)/signin");
      return;
    }

    // 3. Unauthenticated user trying to access protected routes
    //    — redirect to signin
    if (isProtectedRoute) {
      router.replace("/(auth)/signin");
      return;
    }

    // 4. Unauthenticated user on an unknown route (not landing, not auth, not tabs)
    if (!isLandingPage && !isAuthRoute) {
      router.replace("/(auth)/signin");
    }
  }, [isAuthenticated, isInitializing, segments, router, hasSeenLanding]);

  if (isInitializing) {
    return (
      <View className="flex-1 bg-ui-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.gold[500]} />
      </View>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;