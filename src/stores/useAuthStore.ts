import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/src/types/user";
import { ISession } from "../types/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isBiometricEnabled: boolean;
  lastLogin: string | null;
  isAuthenticated: boolean;
  sessions: ISession[];
  hasSeenLanding: boolean;

  // Actions
  setLoading: (val: boolean) => void;
  setError: (msg: string | null) => void;
  setSession: (user: User) => void;
  toggleBiometric: (val: boolean) => void;
  clearSession: () => void;
  setSessions: (sessions: ISession[]) => void;
  removeSession: (sessionId: string) => void;
  removeAllOtherSessions: () => void;
  setHasSeenLanding: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      isBiometricEnabled: false,
      lastLogin: null,
      isAuthenticated: false,
      sessions: [],
      hasSeenLanding: false,

      // UI State Actions
      setLoading: (val: boolean) => set({ isLoading: val }),
      setError: (msg: string | null) => set({ error: msg }),

      setSession: (user: User) =>
        set({
          user,
          isAuthenticated: true,
          lastLogin: new Date().toISOString(),
          isLoading: false,
          error: null,
        }),

      toggleBiometric: (val: boolean) => set({ isBiometricEnabled: val }),

      clearSession: () =>
        set({
          user: null,
          isAuthenticated: false,
          sessions: [],
          lastLogin: null,
          isLoading: false,
          error: null,
        }),

      setSessions: (sessions: ISession[]) =>
        set({ sessions, isLoading: false }),

      removeSession: (sessionId: string) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== sessionId),
        })),

      removeAllOtherSessions: () =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.isCurrent),
        })),

      setHasSeenLanding: (val: boolean) => set({ hasSeenLanding: val }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Optional: Don't persist loading/error states
      partialize: (state) => {
        const { isLoading, error, ...rest } = state;
        return rest;
      },
    },
  ),
);
