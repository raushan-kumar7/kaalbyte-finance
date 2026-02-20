import React, { useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  ScreenWrapper,
  DigitalAssetsCard,
  EquityAssetsCard,
  PortfolioSummaryCard,
  Typo,
  MonthlyIncomeTable,
  DigitalAssetsTable,
  EquityAssetsTable,
} from "@/src/components";
import { colors } from "@/src/constants/colors";
import {
  Coins,
  BarChart3,
  Milestone,
  LayoutGrid,
  Table2,
  TrendingUp,
  Layers,
  RefreshCw,
} from "lucide-react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  useDigitalAssetsPortfolio,
  useEquityPortfolio,
  useAllMonthlyIncomes,
  useUpdateDigitalAsset,
  useDeleteDigitalAsset,
  useUpdateEquityAsset,
  useDeleteEquityAsset,
  useUpdateMonthlyIncome,
  useDeleteMonthlyIncome,
} from "@/src/hooks";
import type { MonthlyIncomeRow } from "@/src/components/tables/MonthlyIncomeTable";

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "overview" | "manage";
type ManageTab = "income" | "digital" | "equity";

const MANAGE_TABS: { id: ManageTab; label: string; color: string }[] = [
  { id: "income",  label: "Income",  color: colors.gold[500] },
  { id: "digital", label: "Digital", color: colors.brand[100] },
  { id: "equity",  label: "Equity",  color: colors.success[500] },
];

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader = ({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
}) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14, marginTop: 8 }}>
    {icon}
    <Typo className="font-mono-bold text-xs ml-2 uppercase tracking-[2px]" style={{ color }}>
      {label}
    </Typo>
  </View>
);

// ─── Stat Pill ────────────────────────────────────────────────────────────────

const StatPill = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <View
    style={{
      flex: 1,
      backgroundColor: `${color}0D`,
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: `${color}20`,
      alignItems: "center",
    }}
  >
    <Typo
      className="font-mono text-[8px] uppercase tracking-widest mb-1"
      style={{ color: colors.text.muted }}
    >
      {label}
    </Typo>
    <Typo className="font-sans-bold text-sm" style={{ color }}>
      {value}
    </Typo>
  </View>
);

// ─── Component ────────────────────────────────────────────────────────────────

const Assets = () => {
  const [viewMode, setViewMode] = React.useState<ViewMode>("overview");
  const [manageTab, setManageTab] = React.useState<ManageTab>("income");

  // ── Data ──────────────────────────────────────────────────────────────────
  const {
    goldAssets,
    silverAssets,
    goldSummary,
    silverSummary,
    isLoading: digitalLoading,
    refresh: refreshDigital,
  } = useDigitalAssetsPortfolio();

  const {
    allAssets: equityAssets,
    summary: equitySummary,
    isLoading: equityLoading,
    refresh: refreshEquity,
  } = useEquityPortfolio();

  const {
    incomes: rawIncomes,
    isLoading: incomeLoading,
    refresh: refreshIncomes,
  } = useAllMonthlyIncomes();

  // ── Map DB rows → MonthlyIncomeRow (camelCase) ────────────────────────────
  // The DB schema returns otherIncome / totalIncome (camelCase via Drizzle).
  // MonthlyIncomeTable expects the same camelCase shape.
  const incomes: MonthlyIncomeRow[] = (rawIncomes ?? []).map((r: any) => ({
    id:          r.id,
    userId:      r.userId,
    month:       r.month,
    salary:      r.salary       ?? 0,
    otherIncome: r.otherIncome  ?? r.other_income  ?? 0,
    totalIncome: r.totalIncome  ?? r.total_income  ?? 0,
  }));

  // ── Actions ───────────────────────────────────────────────────────────────
  const { updateAsset: updateDigital } = useUpdateDigitalAsset();
  const { deleteAsset: deleteDigital } = useDeleteDigitalAsset();
  const { updateAsset: updateEquity }  = useUpdateEquityAsset();
  const { deleteAsset: deleteEquity }  = useDeleteEquityAsset();
  const { updateIncome }               = useUpdateMonthlyIncome();
  const { deleteIncome }               = useDeleteMonthlyIncome();

  const handleUpdateDigital = useCallback(
    async (id: number, updates: any) => (await updateDigital(id, updates)).success,
    [updateDigital],
  );
  const handleDeleteDigital = useCallback(
    async (id: number) => (await deleteDigital(id)).success,
    [deleteDigital],
  );
  const handleUpdateEquity = useCallback(
    async (id: number, updates: any) => (await updateEquity(id, updates)).success,
    [updateEquity],
  );
  const handleDeleteEquity = useCallback(
    async (id: number) => (await deleteEquity(id)).success,
    [deleteEquity],
  );
  const handleUpdateIncome = useCallback(
    async (id: number, updates: any) => (await updateIncome(id, updates)).success,
    [updateIncome],
  );
  const handleDeleteIncome = useCallback(
    async (id: number) => (await deleteIncome(id)).success,
    [deleteIncome],
  );

  // ── Derived ───────────────────────────────────────────────────────────────
  const goldValue   = goldSummary?.totalValue        ?? 0;
  const silverValue = silverSummary?.totalValue      ?? 0;
  const equityValue = equitySummary?.totalInvestment ?? 0;
  const totalPortfolio = goldValue + silverValue + equityValue;

  const isLoading = digitalLoading || equityLoading || incomeLoading;

  const onRefresh = useCallback(() => {
    refreshDigital();
    refreshEquity();
    refreshIncomes();
  }, [refreshDigital, refreshEquity, refreshIncomes]);

  const syncTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ScreenWrapper className="px-4">

      {/* ══════════════════════════════════════════════════════════════════════
          ENHANCED HEADER
      ══════════════════════════════════════════════════════════════════════ */}
      <Animated.View entering={FadeInDown.duration(400)} style={{ paddingTop: 32, paddingHorizontal: 4, marginBottom: 16 }}>

        {/* Row 1: label + view toggle */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 32, height: 32, borderRadius: 10,
                backgroundColor: `${colors.gold[500]}15`,
                alignItems: "center", justifyContent: "center",
                borderWidth: 1, borderColor: `${colors.gold[500]}25`,
              }}
            >
              <Layers size={15} color={colors.gold[500]} strokeWidth={1.8} />
            </View>
            <View>
              <Typo className="text-white font-serif-bold text-2xl leading-tight">
                Portfolio
              </Typo>
              <Typo
                className="font-mono text-[9px] uppercase tracking-widest"
                style={{ color: colors.text.muted }}
              >
                Investment Overview
              </Typo>
            </View>
          </View>

          {/* Overview / Manage toggle */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.ui.card,
              borderRadius: 14, padding: 3,
              borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            {(
              [
                { id: "overview" as ViewMode, icon: LayoutGrid, label: "View" },
                { id: "manage"   as ViewMode, icon: Table2,     label: "Manage" },
              ] as const
            ).map(({ id, icon: Icon, label }) => {
              const active = viewMode === id;
              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => setViewMode(id)}
                  activeOpacity={0.75}
                  style={{
                    paddingHorizontal: 11, paddingVertical: 7, borderRadius: 11,
                    backgroundColor: active ? colors.brand[500] : "transparent",
                    flexDirection: "row", alignItems: "center", gap: 5,
                  }}
                >
                  <Icon size={12} color={active ? colors.white : colors.text.muted} />
                  <Typo
                    className="font-mono text-[10px]"
                    style={{ color: active ? colors.white : colors.text.muted }}
                  >
                    {label}
                  </Typo>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Row 2: total portfolio value + sync */}
        <View
          style={{
            backgroundColor: colors.ui.card,
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.06)",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <View>
            <Typo
              className="font-mono text-[9px] uppercase tracking-widest mb-1"
              style={{ color: colors.text.muted }}
            >
              Total Portfolio
            </Typo>
            <Typo className="text-white font-serif-bold text-[28px] leading-tight">
              ₹{totalPortfolio.toLocaleString("en-IN")}
            </Typo>
          </View>

          {/* Sync badge */}
          <View style={{ alignItems: "flex-end", gap: 6 }}>
            <View
              style={{
                flexDirection: "row", alignItems: "center", gap: 5,
                backgroundColor: `${colors.success[500]}10`,
                paddingHorizontal: 10, paddingVertical: 5,
                borderRadius: 10, borderWidth: 1, borderColor: `${colors.success[500]}20`,
              }}
            >
              <View
                style={{
                  width: 5, height: 5, borderRadius: 3,
                  backgroundColor: colors.success[500],
                }}
              />
              <Typo
                className="font-mono text-[9px] uppercase tracking-wider"
                style={{ color: colors.success[500] }}
              >
                Live
              </Typo>
            </View>
            <TouchableOpacity
              onPress={onRefresh}
              activeOpacity={0.7}
              style={{
                flexDirection: "row", alignItems: "center", gap: 5,
                backgroundColor: "rgba(255,255,255,0.05)",
                paddingHorizontal: 10, paddingVertical: 5,
                borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <RefreshCw size={10} color={colors.text.muted} />
              <Typo
                className="font-mono text-[9px]"
                style={{ color: colors.text.muted }}
              >
                {syncTime}
              </Typo>
            </TouchableOpacity>
          </View>
        </View>

        {/* Row 3: asset breakdown pills */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <StatPill
            label="Gold"
            value={`₹${(goldValue / 1000).toFixed(1)}k`}
            color={colors.gold[500]}
          />
          <StatPill
            label="Silver"
            value={`₹${(silverValue / 1000).toFixed(1)}k`}
            color={colors.brand[100]}
          />
          <StatPill
            label="Equity"
            value={`₹${(equityValue / 1000).toFixed(1)}k`}
            color={colors.success[500]}
          />
        </View>
      </Animated.View>

      {/* Initial load spinner */}
      {isLoading && !goldAssets.length && !equityAssets.length && (
        <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 48 }}>
          <ActivityIndicator size="large" color={colors.gold[500]} />
        </View>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCROLLABLE BODY
      ══════════════════════════════════════════════════════════════════════ */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 4 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={colors.gold[500]}
          />
        }
      >
        {/* ── OVERVIEW MODE ─────────────────────────────────────────────── */}
        {viewMode === "overview" && (
          <Animated.View entering={FadeIn.duration(250)}>
            <PortfolioSummaryCard
              goldValue={goldValue}
              silverValue={silverValue}
              equityValue={equityValue}
            />

            {goldAssets.length > 0 && (
              <>
                <SectionHeader
                  icon={<Coins size={18} color={colors.gold[500]} />}
                  label="Digital Gold"
                  color={colors.gold[500]}
                />
                {goldAssets.map((asset) => (
                  <DigitalAssetsCard key={`gold-${asset.id}`} data={asset} />
                ))}
              </>
            )}

            {silverAssets.length > 0 && (
              <>
                <SectionHeader
                  icon={<Milestone size={18} color={colors.brand[100]} />}
                  label="Digital Silver"
                  color={colors.brand[100]}
                />
                {silverAssets.map((asset) => (
                  <DigitalAssetsCard key={`silver-${asset.id}`} data={asset} />
                ))}
              </>
            )}

            {equityAssets.length > 0 && (
              <>
                <SectionHeader
                  icon={<BarChart3 size={18} color={colors.success[500]} />}
                  label="Equity Holdings"
                  color={colors.success[500]}
                />
                <View style={{ gap: 16 }}>
                  {equityAssets.map((asset) => (
                    <EquityAssetsCard key={`equity-${asset.id}`} data={asset} />
                  ))}
                </View>
              </>
            )}

            {goldAssets.length === 0 && silverAssets.length === 0 && equityAssets.length === 0 && !isLoading && (
              <Animated.View entering={FadeIn.duration(300)} style={{ alignItems: "center", paddingVertical: 48 }}>
                <View
                  style={{
                    width: 56, height: 56, borderRadius: 20,
                    backgroundColor: `${colors.gold[500]}12`,
                    alignItems: "center", justifyContent: "center",
                    marginBottom: 12, borderWidth: 1, borderColor: `${colors.gold[500]}20`,
                  }}
                >
                  <TrendingUp size={26} color={colors.gold[500]} strokeWidth={1.5} />
                </View>
                <Typo className="text-white font-sans-medium text-sm mb-1">No assets yet</Typo>
                <Typo className="font-mono text-[11px]" style={{ color: colors.text.muted }}>
                  Add your first investment
                </Typo>
              </Animated.View>
            )}

            <View style={{ marginTop: 32, marginBottom: 32, alignItems: "center", opacity: 0.25 }}>
              <Typo variant="secondary" className="text-[10px] font-mono uppercase tracking-[4px]">
                End of Portfolio
              </Typo>
            </View>
          </Animated.View>
        )}

        {/* ── MANAGE MODE ───────────────────────────────────────────────── */}
        {viewMode === "manage" && (
          <Animated.View entering={FadeIn.duration(250)}>

            {/* Sub-tab bar */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: colors.ui.card,
                borderRadius: 20, padding: 4,
                borderWidth: 1, borderColor: "rgba(255,255,255,0.05)",
                marginBottom: 16,
              }}
            >
              {MANAGE_TABS.map((tab) => {
                const isActive = manageTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => setManageTab(tab.id)}
                    activeOpacity={0.75}
                    style={{
                      flex: 1, paddingVertical: 10, borderRadius: 16,
                      alignItems: "center",
                      backgroundColor: isActive ? `${tab.color}18` : "transparent",
                      borderWidth: isActive ? 1 : 0,
                      borderColor: isActive ? `${tab.color}30` : "transparent",
                    }}
                  >
                    <Typo
                      className="font-mono text-[11px] uppercase tracking-widest"
                      style={{
                        color: isActive ? tab.color : colors.text.muted,
                        fontFamily: isActive ? "FiraCode-Bold" : "FiraCode-Regular",
                      }}
                    >
                      {tab.label}
                    </Typo>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Tab panels */}
            <Animated.View key={manageTab} entering={FadeInDown.duration(220)}>

              {/* ── Income ── */}
              {manageTab === "income" && (
                <>
                  <SectionHeader
                    icon={<TrendingUp size={17} color={colors.gold[500]} />}
                    label="Monthly Income Records"
                    color={colors.gold[500]}
                  />
                  <MonthlyIncomeTable
                    incomes={incomes}
                    isLoading={incomeLoading}
                    onUpdate={handleUpdateIncome}
                    onDelete={handleDeleteIncome}
                  />
                </>
              )}

              {/* ── Digital ── */}
              {manageTab === "digital" && (
                <>
                  <SectionHeader
                    icon={<Coins size={17} color={colors.gold[500]} />}
                    label="Digital Asset Records"
                    color={colors.gold[500]}
                  />
                  <DigitalAssetsTable
                    assets={[...goldAssets, ...silverAssets]}
                    isLoading={digitalLoading}
                    onUpdate={handleUpdateDigital}
                    onDelete={handleDeleteDigital}
                  />
                </>
              )}

              {/* ── Equity ── */}
              {manageTab === "equity" && (
                <>
                  <SectionHeader
                    icon={<BarChart3 size={17} color={colors.success[500]} />}
                    label="Equity Holding Records"
                    color={colors.success[500]}
                  />
                  <EquityAssetsTable
                    assets={equityAssets}
                    isLoading={equityLoading}
                    onUpdate={handleUpdateEquity}
                    onDelete={handleDeleteEquity}
                  />
                </>
              )}

            </Animated.View>
          </Animated.View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Assets;