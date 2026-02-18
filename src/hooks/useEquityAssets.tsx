import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useEquityAssetsStore } from "../stores";
import { type NewEquityAssets } from "@/src/db/schema";
import { Exchange } from "@/src/types/finance";

/**
 * Hook to manage all equity assets
 */
export const useAllEquityAssets = () => {
  const {
    assets,
    isLoading,
    error,
    loadAllAssets,
    clearError,
  } = useEquityAssetsStore(
    useShallow((state) => ({
      assets: state.assets,
      isLoading: state.isLoading,
      error: state.error,
      loadAllAssets: state.loadAllAssets,
      clearError: state.clearError,
    }))
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

/**
 * Hook to manage assets by exchange
 */
export const useEquityAssetsByExchange = (exchange: Exchange) => {
  const {
    nseAssets,
    bseAssets,
    selectedExchange,
    isLoading,
    error,
    loadAssetsByExchange,
    setSelectedExchange,
    clearError,
  } = useEquityAssetsStore(
    useShallow((state) => ({
      nseAssets: state.nseAssets,
      bseAssets: state.bseAssets,
      selectedExchange: state.selectedExchange,
      isLoading: state.isLoading,
      error: state.error,
      loadAssetsByExchange: state.loadAssetsByExchange,
      setSelectedExchange: state.setSelectedExchange,
      clearError: state.clearError,
    }))
  );

  useEffect(() => {
    setSelectedExchange(exchange);
  }, [exchange, setSelectedExchange]);

  const assets = exchange === Exchange.NSE ? nseAssets : bseAssets;

  return {
    assets,
    exchange: selectedExchange,
    isLoading,
    error,
    refresh: () => loadAssetsByExchange(exchange),
    clearError,
  };
};

/**
 * Hook to get portfolio summary
 */
export const useEquityPortfolioSummary = () => {
  const {
    portfolioSummary,
    isLoading,
    error,
    loadPortfolioSummary,
    clearError,
  } = useEquityAssetsStore(
    useShallow((state) => ({
      portfolioSummary: state.portfolioSummary,
      isLoading: state.isLoading,
      error: state.error,
      loadPortfolioSummary: state.loadPortfolioSummary,
      clearError: state.clearError,
    }))
  );

  useEffect(() => {
    loadPortfolioSummary();
  }, [loadPortfolioSummary]);

  return {
    summary: portfolioSummary,
    isLoading,
    error,
    refresh: loadPortfolioSummary,
    clearError,
  };
};

/**
 * Hook to create a new equity asset
 */
export const useCreateEquityAsset = () => {
  const { createAsset, isLoading, error, clearError } = useEquityAssetsStore(
    useShallow((state) => ({
      createAsset: state.createAsset,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    }))
  );

  const create = async (asset: NewEquityAssets) => {
    try {
      await createAsset(asset);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : "Failed to create asset" 
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

/**
 * Hook to update an equity asset
 */
export const useUpdateEquityAsset = () => {
  const { updateAsset, isLoading, error, clearError } = useEquityAssetsStore(
    useShallow((state) => ({
      updateAsset: state.updateAsset,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    }))
  );

  const update = async (id: number, asset: Partial<NewEquityAssets>) => {
    try {
      await updateAsset(id, asset);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : "Failed to update asset" 
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

/**
 * Hook to delete an equity asset
 */
export const useDeleteEquityAsset = () => {
  const { deleteAsset, isLoading, error, clearError } = useEquityAssetsStore(
    useShallow((state) => ({
      deleteAsset: state.deleteAsset,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    }))
  );

  const remove = async (id: number) => {
    try {
      await deleteAsset(id);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : "Failed to delete asset" 
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

/**
 * Hook to manage complete equity portfolio
 */
export const useEquityPortfolio = () => {
  const {
    assets,
    nseAssets,
    bseAssets,
    portfolioSummary,
    isLoading,
    error,
    refreshData,
    clearError,
  } = useEquityAssetsStore(
    useShallow((state) => ({
      assets: state.assets,
      nseAssets: state.nseAssets,
      bseAssets: state.bseAssets,
      portfolioSummary: state.portfolioSummary,
      isLoading: state.isLoading,
      error: state.error,
      refreshData: state.refreshData,
      clearError: state.clearError,
    }))
  );

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    allAssets: assets,
    nseAssets,
    bseAssets,
    summary: portfolioSummary,
    isLoading,
    error,
    refresh: refreshData,
    clearError,
  };
};