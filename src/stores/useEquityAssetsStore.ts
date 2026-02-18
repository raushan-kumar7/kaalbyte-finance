import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type EquityAssets, type NewEquityAssets } from "@/src/db/schema";
import { Exchange } from "../types/finance";
import { EquityAssetsService } from "../services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUserId } from "../utils/auth";


interface EquityAssetsState {
  // State
  assets: EquityAssets[];
  nseAssets: EquityAssets[];
  bseAssets: EquityAssets[];
  selectedExchange: Exchange | null;
  isLoading: boolean;
  error: string | null;

  // Portfolio data
  portfolioSummary: {
    totalInvestment: number;
    totalShares: number;
    uniqueCompanies: number;
    companiesList: string[];
  } | null;

  // Actions
  loadAllAssets: () => Promise<void>;
  loadAssetsByExchange: (exchange: Exchange) => Promise<void>;
  loadAssetsByCompany: (company: string) => Promise<void>;
  loadPortfolioSummary: () => Promise<void>;
  createAsset: (asset: NewEquityAssets) => Promise<void>;
  updateAsset: (id: number, asset: Partial<NewEquityAssets>) => Promise<void>;
  deleteAsset: (id: number) => Promise<void>;
  setSelectedExchange: (exchange: Exchange | null) => void;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

export const useEquityAssetsStore = create<EquityAssetsState>()(
  persist(
    (set, get) => ({
      // Initial state
      assets: [],
      nseAssets: [],
      bseAssets: [],
      selectedExchange: null,
      isLoading: false,
      error: null,
      portfolioSummary: null,

      // Load all assets
      loadAllAssets: async () => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const assets = await EquityAssetsService.getAllAssets(userId);
          const nseAssets = assets.filter((a) => a.exchange === Exchange.NSE);
          const bseAssets = assets.filter((a) => a.exchange === Exchange.BSE);

          set({
            assets,
            nseAssets,
            bseAssets,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to load assets",
            isLoading: false,
          });
        }
      },

      // Load assets by exchange
      loadAssetsByExchange: async (exchange: Exchange) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const assets =
            await EquityAssetsService.getAssetsByExchange(exchange, userId);

          if (exchange === Exchange.NSE) {
            set({ nseAssets: assets, isLoading: false });
          } else {
            set({ bseAssets: assets, isLoading: false });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to load assets",
            isLoading: false,
          });
        }
      },

      // Load assets by company
      loadAssetsByCompany: async (company: string) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          await EquityAssetsService.getAssetsByCompany(company, userId);
          set({ isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to load assets",
            isLoading: false,
          });
        }
      },

      // Load portfolio summary
      loadPortfolioSummary: async () => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const summary = await EquityAssetsService.getPortfolioSummary(userId);
          set({ portfolioSummary: summary, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to load summary",
            isLoading: false,
          });
        }
      },

      // Create a new asset
      createAsset: async (asset: NewEquityAssets) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const created = await EquityAssetsService.createAsset(asset, userId);

          set((state) => {
            const newAssets = [created, ...state.assets];
            const newNseAssets =
              created.exchange === Exchange.NSE
                ? [created, ...state.nseAssets]
                : state.nseAssets;
            const newBseAssets =
              created.exchange === Exchange.BSE
                ? [created, ...state.bseAssets]
                : state.bseAssets;

            return {
              assets: newAssets,
              nseAssets: newNseAssets,
              bseAssets: newBseAssets,
              isLoading: false,
            };
          });

          await get().loadPortfolioSummary();
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to create asset",
            isLoading: false,
          });
          throw error;
        }
      },

      // Update an asset
      updateAsset: async (id: number, asset: Partial<NewEquityAssets>) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const updated = await EquityAssetsService.updateAsset(id, asset, userId);

          set((state) => ({
            assets: state.assets.map((a) => (a.id === id ? updated : a)),
            nseAssets: state.nseAssets.map((a) => (a.id === id ? updated : a)),
            bseAssets: state.bseAssets.map((a) => (a.id === id ? updated : a)),
            isLoading: false,
          }));

          await get().loadPortfolioSummary();
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to update asset",
            isLoading: false,
          });
          throw error;
        }
      },

      // Delete an asset
      deleteAsset: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          await EquityAssetsService.deleteAsset(id, userId);

          set((state) => ({
            assets: state.assets.filter((a) => a.id !== id),
            nseAssets: state.nseAssets.filter((a) => a.id !== id),
            bseAssets: state.bseAssets.filter((a) => a.id !== id),
            isLoading: false,
          }));

          await get().loadPortfolioSummary();
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to delete asset",
            isLoading: false,
          });
          throw error;
        }
      },

      // Set selected exchange
      setSelectedExchange: (exchange: Exchange | null) => {
        set({ selectedExchange: exchange });
        if (exchange) {
          get().loadAssetsByExchange(exchange);
        }
      },

      // Refresh all data
      refreshData: async () => {
        await Promise.all([
          get().loadAllAssets(),
          get().loadPortfolioSummary(),
        ]);
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "equity-assets-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        assets: state.assets,
        nseAssets: state.nseAssets,
        bseAssets: state.bseAssets,
        portfolioSummary: state.portfolioSummary,
        selectedExchange: state.selectedExchange,
      }),
    },
  ),
);
