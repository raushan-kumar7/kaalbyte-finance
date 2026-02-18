import React from "react";
import { ScrollView, View, ActivityIndicator, RefreshControl } from "react-native";
import {
  ScreenWrapper,
  DigitalAssetsCard,
  EquityAssetsCard,
  PortfolioSummaryCard,
  Typo,
} from "@/src/components";
import { colors } from "@/src/constants/colors";
import { Coins, BarChart3, Milestone } from "lucide-react-native";
import { useDigitalAssetsPortfolio, useEquityPortfolio } from "@/src/hooks";

const Assets = () => {
  const {
    goldAssets,
    silverAssets,
    goldSummary,
    silverSummary,
    isLoading: digitalLoading,
    error: digitalError,
    refresh: refreshDigital,
  } = useDigitalAssetsPortfolio();

  const {
    allAssets: equityAssets,
    summary: equitySummary,
    isLoading: equityLoading,
    error: equityError,
    refresh: refreshEquity,
  } = useEquityPortfolio();

  const portfolioData = {
    gold: goldSummary?.totalValue || 0,
    silver: silverSummary?.totalValue || 0,
    equity: equitySummary?.totalInvestment || 0,
  };

  const isLoading = digitalLoading || equityLoading;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const hasError = digitalError || equityError;

  // Combined refresh handler
  const onRefresh = React.useCallback(() => {
    refreshDigital();
    refreshEquity();
  }, [refreshDigital, refreshEquity]);

  return (
    <ScreenWrapper className="px-4">
      <View>
        <View className="flex-row justify-between items-end py-8 px-1">
          <View>
            <Typo className="text-white font-serif-bold text-3xl tracking-tight">
              Portfolio
            </Typo>
            <View className="flex-row items-center mt-1">
              <View className="w-1.5 h-1.5 rounded-full bg-success-500 mr-2 shadow-sm shadow-success-500" />
              <Typo variant="secondary" className="font-mono text-[10px] uppercase tracking-widest opacity-70">
                Investment Overview
              </Typo>
            </View>
          </View>

          <View className="items-end pb-1">
            <View className="flex-row items-center bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <View className="items-end mr-3">
                <Typo className="text-white/40 font-mono-bold text-[8px] uppercase tracking-tighter">
                  Last Synced
                </Typo>
                <Typo className="text-white/80 font-mono-semibold text-[10px]">
                  {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}, 
                  {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </Typo>
              </View>
              <View className="w-2 h-2 rounded-full bg-gold-500/20 items-center justify-center">
                <View className="w-1 h-1 rounded-full bg-gold-500" />
              </View>
            </View>
          </View>
        </View>
      </View>

      {isLoading && !goldAssets.length && (
        <View className="flex-1 items-center justify-center py-12">
          <ActivityIndicator size="large" color={colors.gold[500]} />
        </View>
      )}

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 90,
          paddingTop: 10
        }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={colors.gold[500]} />
        }
      >
        <PortfolioSummaryCard
          goldValue={portfolioData.gold}
          silverValue={portfolioData.silver}
          equityValue={portfolioData.equity}
        />

        {/* --- GOLD SECTION --- */}
        {goldAssets.length > 0 && (
          <>
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Coins size={18} color={colors.gold[500]} />
                <Typo className="text-gold-500 font-mono-bold text-xs ml-2 uppercase tracking-[2px]">Digital Gold</Typo>
              </View>
            </View>

            {goldAssets.map((asset) => (
              <DigitalAssetsCard 
                key={`gold-${asset.id}`}
                data={asset} 
              />
            ))}
          </>
        )}

        {/* --- SILVER SECTION --- */}
        {silverAssets.length > 0 && (
          <>
            <View className="flex-row justify-between items-center mt-6 mb-4">
              <View className="flex-row items-center">
                <Milestone size={18} color={colors.brand[100]} />
                <Typo className="text-brand-100 font-mono-bold text-xs ml-2 uppercase tracking-[2px]">Digital Silver</Typo>
              </View>
            </View>

            {silverAssets.map((asset) => (
              <DigitalAssetsCard 
                key={`silver-${asset.id}`}
                data={asset} 
              />
            ))}
          </>
        )}

        {/* --- EQUITY SECTION --- */}
        {equityAssets.length > 0 && (
          <>
            <View className="flex-row justify-between items-center mt-6 mb-4">
              <View className="flex-row items-center">
                <BarChart3 size={18} color={colors.success[500]} />
                <Typo className="text-success-500 font-mono-bold text-xs ml-2 uppercase tracking-[2px]">Equity Holdings</Typo>
              </View>
            </View>

            <View className="gap-y-4">
              {equityAssets.map((asset) => (
                <EquityAssetsCard 
                  key={`equity-${asset.id}`}
                  data={asset} 
                />
              ))}
            </View>
          </>
        )}

        <View className="mt-8 mb-8 items-center opacity-30">
          <Typo variant="secondary" className="text-[10px] font-mono uppercase tracking-[4px]">
            End of Portfolio
          </Typo>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Assets;