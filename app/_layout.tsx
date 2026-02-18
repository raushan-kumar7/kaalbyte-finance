import { DatabaseProvider, ToastProvider } from "@/src/providers";
import { Stack } from "expo-router";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { expoDb } from "@/src/db/client";
import { useAuthStore } from "@/src/stores";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/config/firebase";
import { AuthService } from "@/src/services";
import { AuthGuard, FontLoader } from "@/src/components";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "./global.css";

// const StackLayout = () => {
//   const { setSession, clearSession, isLoading } = useAuthStore();
//   const [isInitializing, setIsInitializing] = useState(true);

//   useEffect(() => {
//     let unsubscribe: (() => void) | undefined;

//     const bootstrap = async () => {
//       try {
//         unsubscribe = onAuthStateChanged(auth, async (user) => {
//           try {
//             if (user) {
//               const profile = await AuthService.getCurrentUserProfile();
//               if (profile) {
//                 setSession(profile);
//               } else {
//                 if (!isLoading) {
//                   clearSession();
//                 }
//               }
//             } else {
//               clearSession();
//             }
//           } catch {
//             clearSession();
//           } finally {
//             setIsInitializing(false);
//           }
//         });
//       } catch (err) {
//         console.log("app bootstrap failed: ", err);
//         setIsInitializing(false);
//       }
//     };

//     bootstrap();

//     return () => {
//       if (unsubscribe) {
//         unsubscribe();
//       }
//     };
//   }, [setSession, clearSession, isLoading]);

//   return (
//     <AuthGuard isInitializing={isInitializing}>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="index" />
//         <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
//         <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
//       </Stack>
//     </AuthGuard>
//   );
// };

// const StackLayout = () => {
//   // We pull isLoading from the store to act as a guard
//   const { setSession, clearSession, isLoading } = useAuthStore();
//   const [isInitializing, setIsInitializing] = useState(true);

//   useEffect(() => {
//     let unsubscribe: (() => void) | undefined;

//     const bootstrap = async () => {
//       try {
//         unsubscribe = onAuthStateChanged(auth, async (user) => {
//           try {
//             if (user) {
//               const profile = await AuthService.getCurrentUserProfile();
//               if (profile) {
//                 setSession(profile);
//               } else {
//                 // If profile is missing but we aren't performing an action, clear
//                 if (!isLoading) {
//                   clearSession();
//                 }
//               }
//             } else {
//               /**
//                * CRITICAL FIX:
//                * When changing passwords, Firebase triggers this 'null' user event.
//                * We only clear the session if isLoading is false.
//                */
//               if (!isLoading) {
//                 clearSession();
//               }
//             }
//           } catch (error) {
//             console.error("Auth sync error:", error);
//             if (!isLoading) {
//               clearSession();
//             }
//           } finally {
//             setIsInitializing(false);
//           }
//         });
//       } catch (err) {
//         console.error("App bootstrap failed:", err);
//         setIsInitializing(false);
//       }
//     };

//     bootstrap();

//     return () => {
//       if (unsubscribe) unsubscribe();
//     };
//     // Include isLoading in dependencies so the listener reacts to status changes
//   }, [setSession, clearSession, isLoading]);

//   return (
//     <AuthGuard isInitializing={isInitializing}>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="index" />
//         <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
//         <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
//       </Stack>
//     </AuthGuard>
//   );
// };

const StackLayout = () => {
  const { setSession, clearSession } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const bootstrap = async () => {
      try {
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          try {
            if (user) {
              const profile = await AuthService.getCurrentUserProfile();
              if (profile) {
                setSession(profile);
              } else {
                clearSession();
              }
            } else {
              // Always clear on null user — signout, token expiry, etc.
              clearSession();
            }
          } catch (error) {
            console.error("Auth sync error:", error);
            clearSession();
          } finally {
            setIsInitializing(false);
          }
        });
      } catch (err) {
        console.error("App bootstrap failed:", err);
        setIsInitializing(false);
      }
    };

    bootstrap();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [setSession, clearSession]); // ← removed isLoading

  return (
    <AuthGuard isInitializing={isInitializing}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      </Stack>
    </AuthGuard>
  );
};

// export default function RootLayout() {
//   useDrizzleStudio(expoDb);

//   return (
//     <DatabaseProvider>
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <FontLoader>
//           <SafeAreaProvider>
//             <ToastProvider>
//               <StackLayout />
//             </ToastProvider>
//           </SafeAreaProvider>
//         </FontLoader>
//       </GestureHandlerRootView>
//     </DatabaseProvider>
//   );
// }

export default function RootLayout() {
  useDrizzleStudio(expoDb);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DatabaseProvider>
        <FontLoader>
          <SafeAreaProvider>
            <ToastProvider>
              <StackLayout />
            </ToastProvider>
          </SafeAreaProvider>
        </FontLoader>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
}
