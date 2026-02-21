import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
  Pressable,
} from "react-native";
import { Download, FileText, Table, X } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import Typo from "@/src/components/ui/Typo";
import { exportToPDF, exportToExcel } from "@/src/utils/export";
import { BucketType } from "@/src/types/finance";
import { useAuth } from "@/src/hooks";
import { ExpenseEntry } from "@/src/types/export-data";

interface ExportData {
  month: string;
  month_range: string;
  grandTotal: number;
  bucketTotals: Record<BucketType, number>;
  categoryTotals: Record<string, number>;
  entries: ExpenseEntry[];
}

interface ExportButtonProps {
  data: ExportData;
  totalIncome: number;
}

const EXPORT_OPTIONS = [
  {
    id: "pdf" as const,
    label: "PDF Report",
    description: "Print-ready bank statement",
    icon: FileText,
    accentColor: colors.danger[500],
    iconBg: "bg-danger-500/10",
    iconBorder: "border-danger-500/20",
    tagBg: "bg-danger-500/10",
    tagText: "text-danger-500",
    arrowBg: "bg-danger-500/10",
    tagLabel: "Recommended",
  },
  {
    id: "excel" as const,
    label: "Excel Sheet",
    description: "Two-sheet data workbook",
    icon: Table,
    accentColor: colors.success[500],
    iconBg: "bg-success-500/10",
    iconBorder: "border-success-500/20",
    tagBg: "bg-success-500/10",
    tagText: "text-success-500",
    arrowBg: "bg-success-500/10",
    tagLabel: "Data-rich",
  },
];

const ExportButton = ({ data, totalIncome }: ExportButtonProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState<"pdf" | "excel" | null>(null);

  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { user } = useAuth();

  const openMenu = () => {
    setShowMenu(true);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 72,
        friction: 13,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMenu = (onDone?: () => void) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowMenu(false);
      onDone?.();
    });
  };

  const handleExport = (type: "pdf" | "excel") => {
    closeMenu(async () => {
      setLoading(type);
      try {
        const resolvedName =
          `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
          "Account Holder";
        const resolvedEmail = user?.email ?? "";
        const payload = { ...data, totalIncome };

        if (type === "pdf") {
          await exportToPDF(payload, resolvedName, resolvedEmail);
        } else {
          await exportToExcel(payload, resolvedName, resolvedEmail);
        }
      } catch {
        Alert.alert(
          "Export failed",
          "Something went wrong. Please try again.",
          [{ text: "OK" }],
        );
      } finally {
        setLoading(null);
      }
    });
  };

  const surplus = totalIncome - data.grandTotal;
  const isOverBudget = surplus < 0;

  return (
    <>
      {/* ── Trigger Button ──────────────────────────────────────────────── */}
      <TouchableOpacity
        onPress={openMenu}
        activeOpacity={0.75}
        disabled={!!loading}
        className={`w-10 h-10 rounded-full items-center justify-center border ${
          loading
            ? "bg-gold-500/10 border-gold-500/20"
            : "bg-white/5 border-white/5"
        }`}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.gold[500]} />
        ) : (
          <Download size={17} color={colors.text.secondary} />
        )}
      </TouchableOpacity>

      {/* ── Bottom Sheet Modal ──────────────────────────────────────────── */}
      <Modal
        transparent
        visible={showMenu}
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => closeMenu()}
      >
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            backgroundColor: "rgba(1,5,40,0.88)",
            justifyContent: "flex-end",
          }}
        >
          {/* Backdrop tap to close */}
          <Pressable className="absolute inset-0" onPress={() => closeMenu()} />

          {/* Sheet panel */}
          <Animated.View
            style={{ transform: [{ translateY: slideAnim }] }}
            className="bg-brand-800 rounded-t-[32px] border border-b-0 border-white/5 overflow-hidden pb-12"
          >
            {/* Drag handle */}
            <View className="w-9 h-1 rounded-full bg-white/10 self-center mt-3 mb-6" />

            {/* ── Header ──────────────────────────────────────────────────── */}
            <View className="flex-row items-center justify-between px-6 mb-5">
              <View>
                <Typo className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-1">
                  Export Report
                </Typo>
                <Typo className="font-serif-semibold text-xl text-white">
                  {data.month} {new Date().getFullYear()}
                </Typo>
              </View>

              <TouchableOpacity
                onPress={() => closeMenu()}
                activeOpacity={0.7}
                className="w-9 h-9 rounded-full bg-white/5 items-center justify-center"
              >
                <X size={16} color={colors.text.muted} />
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="h-px bg-white/5 mx-6 mb-5" />

            {/* ── User info strip ──────────────────────────────────────────── */}
            {user && (
              <View className="mx-6 mb-4 flex-row items-center gap-3 px-4 py-3 bg-brand-900/60 rounded-2xl border border-white/5">
                {/* Avatar circle */}
                <View className="w-9 h-9 rounded-full bg-brand-500/20 border border-brand-500/30 items-center justify-center">
                  <Typo className="font-sans-bold text-sm text-brand-100">
                    {(user?.firstName?.[0] ?? "").toUpperCase()}
                  </Typo>
                </View>
                <View className="flex-1">
                  <Typo className="font-sans-semibold text-sm text-white">
                    {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                      "Account Holder"}
                  </Typo>
                  {user?.email ? (
                    <Typo className="font-mono text-[10px] text-text-muted mt-0.5">
                      {user.email}
                    </Typo>
                  ) : null}
                </View>
                <View className="px-2 py-1 rounded-lg bg-gold-500/10 border border-gold-500/20">
                  <Typo className="font-mono text-[9px] text-gold-500 uppercase tracking-wider">
                    Personal
                  </Typo>
                </View>
              </View>
            )}

            {/* ── Summary chip ─────────────────────────────────────────────── */}
            <View className="mx-6 mb-5 flex-row bg-ui-item rounded-[18px] border border-white/5 p-4">
              {/* Total spent */}
              <View className="flex-1">
                <Typo className="font-mono text-[9px] text-text-muted uppercase tracking-widest mb-1">
                  Total Spent
                </Typo>
                <Typo className="font-serif-bold text-xl text-white">
                  ₹{data.grandTotal.toLocaleString("en-IN")}
                </Typo>
                <Typo className="font-mono text-[9px] text-text-muted mt-1">
                  {data.month_range}
                </Typo>
              </View>

              {/* Separator */}
              {totalIncome > 0 && <View className="w-px bg-white/5 mx-4" />}

              {/* Surplus / Deficit */}
              {totalIncome > 0 && (
                <View className="flex-1 items-end">
                  <Typo className="font-mono text-[9px] text-text-muted uppercase tracking-widest mb-1">
                    {isOverBudget ? "Deficit" : "Surplus"}
                  </Typo>
                  <Typo
                    className={`font-serif-bold text-xl ${
                      isOverBudget ? "text-danger-500" : "text-success-500"
                    }`}
                  >
                    {isOverBudget ? "−" : "+"}₹
                    {Math.abs(surplus).toLocaleString("en-IN")}
                  </Typo>
                  <Typo className="font-mono text-[9px] text-text-muted mt-1">
                    {totalIncome > 0
                      ? `${Math.abs((surplus / totalIncome) * 100).toFixed(1)}% of income`
                      : ""}
                  </Typo>
                </View>
              )}
            </View>

            {/* ── Export options ───────────────────────────────────────────── */}
            <View className="px-6 gap-3">
              {EXPORT_OPTIONS.map((option) => {
                const IconComponent = option.icon;
                const isThisLoading = loading === option.id;

                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => handleExport(option.id)}
                    activeOpacity={0.72}
                    disabled={!!loading}
                    className="flex-row items-center bg-white/5 rounded-[20px] border border-white/[0.06] p-4 gap-3"
                  >
                    {/* Icon badge */}
                    <View
                      className={`w-[50px] h-[50px] rounded-[15px] items-center justify-center border ${option.iconBg} ${option.iconBorder}`}
                    >
                      {isThisLoading ? (
                        <ActivityIndicator
                          size="small"
                          color={option.accentColor}
                        />
                      ) : (
                        <IconComponent size={21} color={option.accentColor} />
                      )}
                    </View>

                    {/* Labels */}
                    <View className="flex-1">
                      {/* Label + tag row */}
                      <View className="flex-row items-center gap-2 mb-1">
                        <Typo className="font-sans-semibold text-[15px] text-white">
                          {option.label}
                        </Typo>
                        {/* Pill badge */}
                        <View
                          className={`px-1.5 py-0.5 rounded-md ${option.tagBg}`}
                        >
                          <Typo
                            className={`font-mono-medium text-[8px] uppercase tracking-wider ${option.tagText}`}
                          >
                            {option.tagLabel}
                          </Typo>
                        </View>
                      </View>
                      <Typo className="font-mono text-[11px] text-text-muted">
                        {option.description}
                      </Typo>
                    </View>

                    {/* Arrow badge */}
                    <View
                      className={`w-[30px] h-[30px] rounded-[10px] items-center justify-center ${option.arrowBg}`}
                    >
                      <Typo
                        className="font-sans-bold text-base"
                        style={{ color: option.accentColor, lineHeight: 20 }}
                      >
                        ↗
                      </Typo>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ── Footer hint ──────────────────────────────────────────────── */}
            <Typo className="font-mono text-[10px] text-text-muted text-center mt-5 px-8 leading-4">
              Files are saved to your device and shareable via any app
            </Typo>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
};

export default ExportButton;
