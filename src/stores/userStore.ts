import { create } from "zustand";
import { User } from "../types/user";

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  updateUserState: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  clearStore: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user, isLoading: false }),
  updateUserState: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  clearStore: () => set({ user: null, isLoading: false }),
}));
