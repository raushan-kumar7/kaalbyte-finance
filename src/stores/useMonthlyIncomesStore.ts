import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type MonthlyIncome, type NewMonthlyIncome } from "@/src/db/schema";
import { MonthlyIncomesService } from "../services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUserId } from "../utils/auth";

interface MonthlyIncomesState {
  // State
  incomes: MonthlyIncome[];
  selectedMonthIncome: MonthlyIncome | null;
  selectedMonth: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadAllIncomes: () => Promise<void>;
  loadIncomeByMonth: (month: string) => Promise<void>;
  createIncome: (income: NewMonthlyIncome) => Promise<void>;
  updateIncome: (
    id: number,
    income: Partial<NewMonthlyIncome>,
  ) => Promise<void>;
  deleteIncome: (id: number) => Promise<void>;
  upsertIncome: (month: string, income: NewMonthlyIncome) => Promise<void>;
  setSelectedMonth: (month: string) => void;
  clearError: () => void;
}

export const useMonthlyIncomesStore = create<MonthlyIncomesState>()(
  persist(
    (set, get) => ({
      // Initial state
      incomes: [],
      selectedMonthIncome: null,
      selectedMonth: new Date().toISOString().slice(0, 7), // yyyy-mm format
      isLoading: false,
      error: null,

      // Load all income records
      loadAllIncomes: async () => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const incomes = await MonthlyIncomesService.getAllIncomes(userId);
          set({ incomes, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to load incomes",
            isLoading: false,
          });
        }
      },

      // Load income for a specific month
      loadIncomeByMonth: async (month: string) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const income = await MonthlyIncomesService.getIncomeByMonth(
            month,
            userId,
          );
          set({
            selectedMonthIncome: income || null,
            selectedMonth: month,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to load income",
            isLoading: false,
          });
        }
      },

      // Create a new income record
      createIncome: async (income: NewMonthlyIncome) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const created = await MonthlyIncomesService.createIncome(
            income,
            userId,
          );
          set((state) => ({
            incomes: [created, ...state.incomes],
            isLoading: false,
          }));
          if (income.month === get().selectedMonth) {
            set({ selectedMonthIncome: created });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "failed to create income",
            isLoading: false,
          });
          throw error;
        }
      },

      // Update an income record
      updateIncome: async (id: number, income: Partial<NewMonthlyIncome>) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const updated = await MonthlyIncomesService.updateIncome(
            id,
            income,
            userId,
          );
          set((state) => ({
            incomes: state.incomes.map((i) => (i.id === id ? updated : i)),
            isLoading: false,
          }));
          if (get().selectedMonthIncome?.id === id) {
            set({ selectedMonthIncome: updated });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "failed to update income",
            isLoading: false,
          });
          throw error;
        }
      },

      // Delete an income record
      deleteIncome: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          await MonthlyIncomesService.deleteIncome(id, userId);
          set((state) => ({
            incomes: state.incomes.filter((i) => i.id !== id),
            isLoading: false,
          }));
          if (get().selectedMonthIncome?.id === id) {
            set({ selectedMonthIncome: null });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "failed to delete income",
            isLoading: false,
          });
          throw error;
        }
      },

      // Upsert income for a month
      upsertIncome: async (month: string, income: NewMonthlyIncome) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const upserted = await MonthlyIncomesService.upsertIncome(
            month,
            income,
            userId,
          );
          set((state) => {
            const existingIndex = state.incomes.findIndex(
              (i) => i.month === month,
            );
            if (existingIndex >= 0) {
              const updatedIncomes = [...state.incomes];
              updatedIncomes[existingIndex] = upserted;
              return { incomes: updatedIncomes, isLoading: false };
            } else {
              return {
                incomes: [upserted, ...state.incomes],
                isLoading: false,
              };
            }
          });
          if (month === get().selectedMonth) {
            set({ selectedMonthIncome: upserted });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "failed to upsert income",
            isLoading: false,
          });
          throw error;
        }
      },

      // Set selected month
      setSelectedMonth: (month: string) => {
        set({ selectedMonth: month });
        get().loadIncomeByMonth(month);
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "monthly-incomes-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        incomes: state.incomes,
        selectedMonth: state.selectedMonth,
        selectedMonthIncome: state.selectedMonthIncome,
      }),
    },
  ),
);
