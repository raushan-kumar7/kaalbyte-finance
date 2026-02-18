import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useDigitalAssetsStore } from "../stores";
import { type NewDigitalAssets } from "@/src/db/schema";
import { DigitalGoldOrSilverAssetType } from "@/src/types/finance";

export const useAllDigitalAssets = () => {
  const { assets, isLoading, error, loadAllAssets, clearError } =
    useDigitalAssetsStore(
      useShallow((state) => ({
        assets: state.assets,
        isLoading: state.isLoading,
        error: state.error,
        loadAllAssets: state.loadAllAssets,
        clearError: state.clearError,
      })),
    );

  useEffect(() => {
    loadAllAssets();
  }, [loadAllAssets]);

  return {
    assets,
    isLoading,
    error,
    refresh: loadAllAssets,
    clearError,
  };
};

export const useDigitalAssetsByType = (type: DigitalGoldOrSilverAssetType) => {
  const {
    goldAssets,
    silverAssets,
    selectedType,
    isLoading,
    error,
    loadAssetsByType,
    setSelectedType,
    clearError,
  } = useDigitalAssetsStore(
    useShallow((state) => ({
      goldAssets: state.goldAssets,
      silverAssets: state.silverAssets,
      selectedType: state.selectedType,
      isLoading: state.isLoading,
      error: state.error,
      loadAssetsByType: state.loadAssetsByType,
      setSelectedType: state.setSelectedType,
      clearError: state.clearError,
    })),
  );

  useEffect(() => {
    setSelectedType(type);
  }, [type, setSelectedType]);

  const assets =
    type === DigitalGoldOrSilverAssetType.GOLD ? goldAssets : silverAssets;

  return {
    assets,
    type: selectedType,
    isLoading,
    error,
    refresh: () => loadAssetsByType(type),
    clearError,
  };
};

export const useDigitalAssetsSummary = (type: DigitalGoldOrSilverAssetType) => {
  const {
    goldSummary,
    silverSummary,
    isLoading,
    error,
    loadPortfolioSummary,
    clearError,
  } = useDigitalAssetsStore(
    useShallow((state) => ({
      goldSummary: state.goldSummary,
      silverSummary: state.silverSummary,
      isLoading: state.isLoading,
      error: state.error,
      loadPortfolioSummary: state.loadPortfolioSummary,
      clearError: state.clearError,
    })),
  );

  useEffect(() => {
    loadPortfolioSummary(type);
  }, [type, loadPortfolioSummary]);

  const summary =
    type === DigitalGoldOrSilverAssetType.GOLD ? goldSummary : silverSummary;

  return {
    summary,
    isLoading,
    error,
    refresh: () => loadPortfolioSummary(type),
    clearError,
  };
};

export const useCreateDigitalAsset = () => {
  const { createAsset, isLoading, error, clearError } = useDigitalAssetsStore(
    useShallow((state) => ({
      createAsset: state.createAsset,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    })),
  );

  const create = async (asset: NewDigitalAssets) => {
    try {
      await createAsset(asset);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create asset",
      };
    }
  };

  return {
    createAsset: create,
    isLoading,
    error,
    clearError,
  };
};

export const useUpdateDigitalAsset = () => {
  const { updateAsset, isLoading, error, clearError } = useDigitalAssetsStore(
    useShallow((state) => ({
      updateAsset: state.updateAsset,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    })),
  );

  const update = async (id: number, asset: Partial<NewDigitalAssets>) => {
    try {
      await updateAsset(id, asset);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update asset",
      };
    }
  };

  return {
    updateAsset: update,
    isLoading,
    error,
    clearError,
  };
};

export const useDeleteDigitalAsset = () => {
  const { deleteAsset, isLoading, error, clearError } = useDigitalAssetsStore(
    useShallow((state) => ({
      deleteAsset: state.deleteAsset,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    })),
  );

  const remove = async (id: number) => {
    try {
      await deleteAsset(id);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete asset",
      };
    }
  };

  return {
    deleteAsset: remove,
    isLoading,
    error,
    clearError,
  };
};

export const useDigitalAssetsPortfolio = () => {
  const {
    goldAssets,
    silverAssets,
    goldSummary,
    silverSummary,
    isLoading,
    error,
    refreshData,
    clearError,
  } = useDigitalAssetsStore(
    useShallow((state) => ({
      goldAssets: state.goldAssets,
      silverAssets: state.silverAssets,
      goldSummary: state.goldSummary,
      silverSummary: state.silverSummary,
      isLoading: state.isLoading,
      error: state.error,
      refreshData: state.refreshData,
      clearError: state.clearError,
    })),
  );

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    goldAssets,
    silverAssets,
    goldSummary,
    silverSummary,
    isLoading,
    error,
    refresh: refreshData,
    clearError,
  };
};
