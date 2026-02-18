import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type DigitalAssets, type NewDigitalAssets } from "@/src/db/schema";
import { DigitalGoldOrSilverAssetType } from "../types/finance";
import { DigitalAssetsService } from "../services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUserId } from "../utils/auth";


interface DigitalAssetsState {
  // State
  assets: DigitalAssets[];
  goldAssets: DigitalAssets[];
  silverAssets: DigitalAssets[];
  selectedType: DigitalGoldOrSilverAssetType;
  isLoading: boolean;
  error: string | null;

  // Portfolio summaries
  goldSummary: {
    totalWeight: number;
    totalValue: number;
    totalInvestment: number;
    averageRate: number;
    assetCount: number;
  } | null;
  silverSummary: {
    totalWeight: number;
    totalValue: number;
    totalInvestment: number;
    averageRate: number;
    assetCount: number;
  } | null;

  // Actions
  loadAllAssets: () => Promise<void>;
  loadAssetsByType: (type: DigitalGoldOrSilverAssetType) => Promise<void>;
  loadPortfolioSummary: (type: DigitalGoldOrSilverAssetType) => Promise<void>;
  createAsset: (asset: NewDigitalAssets) => Promise<void>;
  updateAsset: (id: number, asset: Partial<NewDigitalAssets>) => Promise<void>;
  deleteAsset: (id: number) => Promise<void>;
  setSelectedType: (type: DigitalGoldOrSilverAssetType) => void;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

export const useDigitalAssetsStore = create<DigitalAssetsState>()(
  persist(
    (set, get) => ({
      // Initial state
      assets: [],
      goldAssets: [],
      silverAssets: [],
      selectedType: DigitalGoldOrSilverAssetType.GOLD,
      isLoading: false,
      error: null,
      goldSummary: null,
      silverSummary: null,

      // Load all assets
      loadAllAssets: async () => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const assets = await DigitalAssetsService.getAllAssets(userId);
          const goldAssets = assets.filter(
            (a) => a.type === DigitalGoldOrSilverAssetType.GOLD,
          );
          const silverAssets = assets.filter(
            (a) => a.type === DigitalGoldOrSilverAssetType.SILVER,
          );

          set({
            assets,
            goldAssets,
            silverAssets,
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

      // Load assets by type
      loadAssetsByType: async (type: DigitalGoldOrSilverAssetType) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const assets = await DigitalAssetsService.getAssetsByType(type, userId);

          if (type === DigitalGoldOrSilverAssetType.GOLD) {
            set({ goldAssets: assets, isLoading: false });
          } else {
            set({ silverAssets: assets, isLoading: false });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to load assets",
            isLoading: false,
          });
        }
      },

      // Load portfolio summary
      loadPortfolioSummary: async (type: DigitalGoldOrSilverAssetType) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const summary = await DigitalAssetsService.getPortfolioSummary(type, userId);

          if (type === DigitalGoldOrSilverAssetType.GOLD) {
            set({ goldSummary: summary, isLoading: false });
          } else {
            set({ silverSummary: summary, isLoading: false });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to load summary",
            isLoading: false,
          });
        }
      },

      // Create a new asset
      createAsset: async (asset: NewDigitalAssets) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const created = await DigitalAssetsService.createAsset(asset, userId);

          // Add to appropriate list
          if (created.type === DigitalGoldOrSilverAssetType.GOLD) {
            set((state) => ({
              goldAssets: [created, ...state.goldAssets],
              assets: [created, ...state.assets],
              isLoading: false,
            }));
          } else {
            set((state) => ({
              silverAssets: [created, ...state.silverAssets],
              assets: [created, ...state.assets],
              isLoading: false,
            }));
          }

          // Refresh summary
          await get().loadPortfolioSummary(created.type);
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
      updateAsset: async (id: number, asset: Partial<NewDigitalAssets>) => {
        set({ isLoading: true, error: null });
        try {
          const userId = getCurrentUserId();
          const updated = await DigitalAssetsService.updateAsset(id, asset, userId);

          // Update in all relevant lists
          set((state) => ({
            assets: state.assets.map((a) => (a.id === id ? updated : a)),
            goldAssets: state.goldAssets.map((a) =>
              a.id === id ? updated : a,
            ),
            silverAssets: state.silverAssets.map((a) =>
              a.id === id ? updated : a,
            ),
            isLoading: false,
          }));

          // Refresh summary
          await get().loadPortfolioSummary(updated.type);
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
          // Get the asset type before deleting
          const asset = get().assets.find((a) => a.id === id);
          if (!asset) throw new Error("asset not found");

          const userId = getCurrentUserId();

          await DigitalAssetsService.deleteAsset(id, userId);

          // Remove from all lists
          set((state) => ({
            assets: state.assets.filter((a) => a.id !== id),
            goldAssets: state.goldAssets.filter((a) => a.id !== id),
            silverAssets: state.silverAssets.filter((a) => a.id !== id),
            isLoading: false,
          }));

          // Refresh summary
          await get().loadPortfolioSummary(asset.type);
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "failed to delete asset",
            isLoading: false,
          });
          throw error;
        }
      },

      // Set selected type
      setSelectedType: (type: DigitalGoldOrSilverAssetType) => {
        set({ selectedType: type });
        get().loadAssetsByType(type);
        get().loadPortfolioSummary(type);
      },

      // Refresh all data
      refreshData: async () => {
        await Promise.all([
          get().loadAllAssets(),
          get().loadPortfolioSummary(DigitalGoldOrSilverAssetType.GOLD),
          get().loadPortfolioSummary(DigitalGoldOrSilverAssetType.SILVER),
        ]);
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "digital-assets-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        assets: state.assets,
        goldAssets: state.goldAssets,
        silverAssets: state.silverAssets,
        goldSummary: state.goldSummary,
        silverSummary: state.silverSummary,
        selectedType: state.selectedType,
      }),
    },
  ),
);
