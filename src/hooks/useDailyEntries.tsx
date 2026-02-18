import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { type NewDailyEntry } from "@/src/db/schema";
import { useDailyEntriesStore } from "../stores";

export const useCurrentMonthEntries = () => {
  const {
    currentMonthEntries,
    selectedMonth,
    isLoading,
    error,
    loadEntriesByMonth,
    setSelectedMonth,
    createEntry,
    updateEntry,
    deleteEntry,
    clearError,
  } = useDailyEntriesStore(
    useShallow((state) => ({
      currentMonthEntries: state.currentMonthEntries,
      selectedMonth: state.selectedMonth,
      isLoading: state.isLoading,
      error: state.error,
      loadEntriesByMonth: state.loadEntriesByMonth,
      setSelectedMonth: state.setSelectedMonth,
      createEntry: state.createEntry,
      updateEntry: state.updateEntry,
      deleteEntry: state.deleteEntry,
      clearError: state.clearError,
    })),
  );

  useEffect(() => {
    loadEntriesByMonth(selectedMonth);
  }, [loadEntriesByMonth, selectedMonth]);

  return {
    entries: currentMonthEntries,
    selectedMonth,
    isLoading,
    error,
    setSelectedMonth,
    createEntry,
    updateEntry,
    deleteEntry,
    clearError,
  };
};

export const useMonthlyExpenseSummary = (month?: string) => {
  const {
    monthlyExpenseSummary,
    selectedMonth,
    isLoading,
    error,
    loadMonthlyExpenseSummary,
    clearError,
  } = useDailyEntriesStore(
    useShallow((state) => ({
      monthlyExpenseSummary: state.monthlyExpenseSummary,
      selectedMonth: state.selectedMonth,
      isLoading: state.isLoading,
      error: state.error,
      loadMonthlyExpenseSummary: state.loadMonthlyExpenseSummary,
      clearError: state.clearError,
    })),
  );

  const targetMonth = month || selectedMonth;

  useEffect(() => {
    loadMonthlyExpenseSummary(targetMonth);
  }, [loadMonthlyExpenseSummary, targetMonth]);

  return {
    summary: monthlyExpenseSummary,
    isLoading,
    error,
    refresh: () => loadMonthlyExpenseSummary(targetMonth),
    clearError,
  };
};

export const useCreateDailyEntry = () => {
  const { createEntry, isLoading, error, clearError } = useDailyEntriesStore(
    useShallow((state) => ({
      createEntry: state.createEntry,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    })),
  );

  const create = async (entry: NewDailyEntry) => {
    try {
      await createEntry(entry);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create entry",
      };
    }
  };

  return {
    createEntry: create,
    isLoading,
    error,
    clearError,
  };
};

export const useUpdateDailyEntry = () => {
  const { updateEntry, isLoading, error, clearError } = useDailyEntriesStore(
    useShallow((state) => ({
      updateEntry: state.updateEntry,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    })),
  );

  const update = async (id: number, entry: Partial<NewDailyEntry>) => {
    try {
      await updateEntry(id, entry);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update entry",
      };
    }
  };

  return {
    updateEntry: update,
    isLoading,
    error,
    clearError,
  };
};

export const useDeleteDailyEntry = () => {
  const { deleteEntry, isLoading, error, clearError } = useDailyEntriesStore(
    useShallow((state) => ({
      deleteEntry: state.deleteEntry,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    })),
  );

  const remove = async (id: number) => {
    try {
      await deleteEntry(id);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete entry",
      };
    }
  };

  return {
    deleteEntry: remove,
    isLoading,
    error,
    clearError,
  };
};

export const useAllDailyEntries = () => {
  const { entries, isLoading, error, loadAllEntries, clearError } =
    useDailyEntriesStore(
      useShallow((state) => ({
        entries: state.entries,
        isLoading: state.isLoading,
        error: state.error,
        loadAllEntries: state.loadAllEntries,
        clearError: state.clearError,
      })),
    );

  useEffect(() => {
    loadAllEntries();
  }, [loadAllEntries]);

  return {
    entries,
    isLoading,
    error,
    refresh: loadAllEntries,
    clearError,
  };
};
