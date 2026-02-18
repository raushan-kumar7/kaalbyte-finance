import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type DailyEntry, type NewDailyEntry } from "@/src/db/schema";
import type { MonthlyExpenseTracker } from "@/src/types/finance";
import { DailyEntriesService } from "../services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUserId } from "../utils/auth";

interface DailyEntriesState {
  // State
  entries: DailyEntry[];
  currentMonthEntries: DailyEntry[];
  selectedMonth: string;
  monthlyExpenseSummary: MonthlyExpenseTracker | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadAllEntries: () => Promise<void>;
  loadEntriesByMonth: (month: string) => Promise<void>;
  loadMonthlyExpenseSummary: (month: string) => Promise<void>;
  createEntry: (entry: NewDailyEntry) => Promise<void>;
  updateEntry: (id: number, entry: Partial<NewDailyEntry>) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
  setSelectedMonth: (month: string) => void;
  refreshCurrentMonth: () => Promise<void>;
  clearError: () => void;
}

export const useDailyEntriesStore = create<DailyEntriesState>()(
  persist(
    (set, get) => ({
      // Initial state
      entries: [],
      currentMonthEntries: [],
      selectedMonth: new Date().toISOString().slice(0, 7), // yyyy-mm format
      monthlyExpenseSummary: null,
      isLoading: false,
      error: null,

      // Load all entries
      loadAllEntries: async () => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const entries = await DailyEntriesService.getAllEntries(userId);
          set({ entries, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to load entries",
            isLoading: false,
          });
        }
      },

      // Load entries for a specific month
      loadEntriesByMonth: async (month: string) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const entries = await DailyEntriesService.getEntriesByMonth(
            month,
            userId,
          );
          set({
            currentMonthEntries: entries,
            selectedMonth: month,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to load entries",
            isLoading: false,
          });
        }
      },

      // Load monthly expense summary
      loadMonthlyExpenseSummary: async (month: string) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const summary = await DailyEntriesService.getMonthlyExpenseSummary(
            month,
            userId,
          );
          set({
            monthlyExpenseSummary: summary,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to load summary",
            isLoading: false,
          });
        }
      },

      // Create a new entry
      createEntry: async (entry: NewDailyEntry) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          await DailyEntriesService.createEntry(entry, userId);

          const entryMonth = new Date(entry.date).toISOString().slice(0, 7);
          const { selectedMonth } = get();

          if (entryMonth === selectedMonth) {
            await get().refreshCurrentMonth();
          }

          set({ isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to create entry",
            isLoading: false,
          });
          throw error;
        }
      },

      // Update an entry
      updateEntry: async (id: number, entry: Partial<NewDailyEntry>) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          await DailyEntriesService.updateEntry(id, entry, userId);
          await get().refreshCurrentMonth();
          set({ isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to update entry",
            isLoading: false,
          });
          throw error;
        }
      },

      // Delete an entry
      deleteEntry: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          await DailyEntriesService.deleteEntry(id, userId);
          await get().refreshCurrentMonth();
          set({ isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to delete entry",
            isLoading: false,
          });
          throw error;
        }
      },

      // Set selected month
      setSelectedMonth: (month: string) => {
        set({ selectedMonth: month });
        get().loadEntriesByMonth(month);
        get().loadMonthlyExpenseSummary(month);
      },

      // Refresh current month data
      refreshCurrentMonth: async () => {
        const { selectedMonth } = get();
        await Promise.all([
          get().loadEntriesByMonth(selectedMonth),
          get().loadMonthlyExpenseSummary(selectedMonth),
        ]);
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "daily-entries-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedMonth: state.selectedMonth,
        entries: state.entries,
        currentMonthEntries: state.currentMonthEntries,
      }),
    },
  ),
);
