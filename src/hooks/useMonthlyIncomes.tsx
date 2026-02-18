import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useMonthlyIncomesStore } from "../stores";
import { type NewMonthlyIncome } from "@/src/db/schema";

export const useAllMonthlyIncomes = () => {
  const { incomes, isLoading, error, loadAllIncomes, clearError } =
    useMonthlyIncomesStore(
      useShallow((state) => ({
        incomes: state.incomes,
        isLoading: state.isLoading,
        error: state.error,
        loadAllIncomes: state.loadAllIncomes,
        clearError: state.clearError,
      })),
    );

  useEffect(() => {
    loadAllIncomes();
  }, [loadAllIncomes]);

  return {
    incomes,
    isLoading,
    error,
    refresh: loadAllIncomes,
    clearError,
  };
};

export const useMonthlyIncome = (month?: string) => {
  const {
    selectedMonthIncome,
    selectedMonth,
    isLoading,
    error,
    loadIncomeByMonth,
    clearError,
  } = useMonthlyIncomesStore(
    useShallow((state) => ({
      selectedMonthIncome: state.selectedMonthIncome,
      selectedMonth: state.selectedMonth,
      isLoading: state.isLoading,
      error: state.error,
      loadIncomeByMonth: state.loadIncomeByMonth,
      clearError: state.clearError,
    })),
  );

  // Use the provided month or fall back to selectedMonth
  const targetMonth = month || selectedMonth;

  useEffect(() => {
    // Only load if targetMonth is different from what's currently loaded
    // This prevents infinite loops
    loadIncomeByMonth(targetMonth);
  }, [targetMonth, loadIncomeByMonth]);

  return {
    income: selectedMonthIncome,
    month: targetMonth,
    isLoading,
    error,
    refresh: () => loadIncomeByMonth(targetMonth),
    clearError,
  };
};

export const useCreateMonthlyIncome = () => {
  const { createIncome, isLoading, error, clearError } = useMonthlyIncomesStore(
    useShallow((state) => ({
      createIncome: state.createIncome,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    })),
  );

  const create = async (income: NewMonthlyIncome) => {
    try {
      await createIncome(income);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create income",
      };
    }
  };

  return {
    createIncome: create,
    isLoading,
    error,
    clearError,
  };
};

export const useUpdateMonthlyIncome = () => {
  const { updateIncome, isLoading, error, clearError } = useMonthlyIncomesStore(
    useShallow((state) => ({
      updateIncome: state.updateIncome,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    })),
  );

  const update = async (id: number, income: Partial<NewMonthlyIncome>) => {
    try {
      await updateIncome(id, income);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update income",
      };
    }
  };

  return {
    updateIncome: update,
    isLoading,
    error,
    clearError,
  };
};

export const useDeleteMonthlyIncome = () => {
  const { deleteIncome, isLoading, error, clearError } = useMonthlyIncomesStore(
    useShallow((state) => ({
      deleteIncome: state.deleteIncome,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    })),
  );

  const remove = async (id: number) => {
    try {
      await deleteIncome(id);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete income",
      };
    }
  };

  return {
    deleteIncome: remove,
    isLoading,
    error,
    clearError,
  };
};

export const useUpsertMonthlyIncome = () => {
  const { upsertIncome, isLoading, error, clearError } = useMonthlyIncomesStore(
    useShallow((state) => ({
      upsertIncome: state.upsertIncome,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    })),
  );

  const upsert = async (month: string, income: NewMonthlyIncome) => {
    try {
      await upsertIncome(month, income);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to save income",
      };
    }
  };

  return {
    upsertIncome: upsert,
    isLoading,
    error,
    clearError,
  };
};