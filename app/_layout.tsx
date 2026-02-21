import { DatabaseProvider, ToastProvider } from "@/src/providers";
import { Stack } from "expo-router";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { expoDb } from "@/src/db/client";
import { useAuthStore } from "@/src/stores";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/config/firebase";
import { AuthService, SyncService } from "@/src/services";
import { AuthGuard, FontLoader } from "@/src/components";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SyncScheduler } from "@/src/schedulers";
import AsyncStorage from "@react-native-async-storage/async-storage";

import "./global.css";

const RESTORE_DONE_KEY = "cloud_restore_done";

const StackLayout = () => {
  const { setSession, clearSession } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  // Register background sync once on mount
  useEffect(() => {
    SyncScheduler.register();
    SyncScheduler.setupNotificationHandler();
  }, []);

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
                await maybeRestoreFromCloud(user.uid);
              } else {
                clearSession();
              }
            } else {
              // Always clear on null user — signout, token expiry, etc.
              clearSession();
            }
          } catch (error) {
            console.error("[Layout] Auth sync error:", error);
            clearSession();
          } finally {
            setIsInitializing(false);
          }
        });
      } catch (err) {
        console.error("[Layout] App bootstrap failed:", err);
        setIsInitializing(false);
      }
    };

    bootstrap();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [setSession, clearSession]);

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

async function maybeRestoreFromCloud(userId: string): Promise<void> {
  const alreadyRestored = await AsyncStorage.getItem(RESTORE_DONE_KEY);
  if (alreadyRestored) return;

  const restored = await SyncService.restoreFromCloud(userId);

  // Even if not restored (no backup found), we mark it done
  // so we don't keep checking every single boot-up.
  await AsyncStorage.setItem(RESTORE_DONE_KEY, "true");

  if (restored) {
    console.log("[Layout] ✅ Cloud restore applied to local DB");
  } else {
    console.log("[Layout] No backup found, starting with local data.");
  }
}

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
