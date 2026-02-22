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
  const [restoreKey, setRestoreKey] = useState(0);

  useEffect(() => {
    SyncScheduler.register();
    SyncScheduler.setupNotificationHandler();
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const bootstrap = async () => {
      try {
        await AsyncStorage.multiRemove(["turso_migrated", RESTORE_DONE_KEY]);

        unsubscribe = onAuthStateChanged(auth, async (user) => {
          try {
            if (user) {
              const profile = await AuthService.getCurrentUserProfile();
              if (profile) {
                setSession(profile);

                const didRestore = await maybeRestoreFromCloud(user.uid);

                // Re-mount all screens if any table was restored from Turso
                if (didRestore) {
                  setRestoreKey((k) => k + 1);
                }
              } else {
                clearSession();
              }
            } else {
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
      <Stack key={restoreKey} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      </Stack>
    </AuthGuard>
  );
};

async function maybeRestoreFromCloud(userId: string): Promise<boolean> {
  try {
    const alreadyRestored = await AsyncStorage.getItem(RESTORE_DONE_KEY);
    if (alreadyRestored) {
      console.log("[Layout] Restore already done for this session — skipping");
      return false;
    }

    console.log("[Layout] Running smart sync on login...");
    const didRestore = await SyncService.smartSync(userId);

    await AsyncStorage.setItem(RESTORE_DONE_KEY, "true");

    if (didRestore) {
      console.log("[Layout] ✅ Some tables restored from Turso — re-rendering");
    } else {
      console.log("[Layout] ✅ Smart sync complete — no restore needed");
    }

    return didRestore;
  } catch (err) {
    console.error("[Layout] ❌ maybeRestoreFromCloud failed:", err);
    return false;
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
