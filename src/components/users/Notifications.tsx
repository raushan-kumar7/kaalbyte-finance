import React from "react";
import {
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  BellRing,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
  CalendarDays,
  Send,
} from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { cn } from "@/src/utils/cn";
import { ModalWrapper } from "../shared";
import { Typo } from "../ui";
import {
  useAuth,
  useReportPreference,
  ReportFormat,
  useNotificationSettings,
} from "@/src/hooks";


const Notifications = ({ onBack }: { onBack: () => void }) => {
  const { user } = useAuth();

  const { settings, toggle } = useNotificationSettings();

  // ── Report format + email sender ──────────────────────────────────────────
  const { reportFormat, setReportFormat, isSending, sendReportEmail } =
    useReportPreference({
      userName:
        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
        "Account Holder",
      userEmail: user?.email ?? "",
    });

  // ── Shared sub-components ─────────────────────────────────────────────────

  const SectionLabel = ({ children }: { children: string }) => (
    <Typo className="text-text-secondary font-mono-bold text-[10px] uppercase tracking-[2px] mb-3 px-1">
      {children}
    </Typo>
  );

  const ToggleItem = ({
    icon: Icon,
    title,
    sub,
    value,
    onToggle,
    isLast = false,
  }: {
    icon: any;
    title: string;
    sub: string;
    value: boolean;
    onToggle: () => void;
    isLast?: boolean;
  }) => (
    <View
      className={`flex-row items-center py-5 ${
        !isLast ? "border-b border-white/5" : ""
      }`}
    >
      <View className="w-10 h-10 rounded-xl bg-gold-500/10 items-center justify-center">
        <Icon size={20} color={colors.gold[500]} />
      </View>
      <View className="flex-1 ml-4 mr-2">
        <Typo className="text-white font-sans-semibold text-[15px]">
          {title}
        </Typo>
        <Typo className="text-text-secondary text-[12px]">{sub}</Typo>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#1A1A1A", true: colors.gold[500] }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  const FormatPill = ({
    fmt,
    label,
    icon: Icon,
  }: {
    fmt: ReportFormat;
    label: string;
    icon: any;
  }) => {
    const isActive = reportFormat === fmt;
    return (
      <TouchableOpacity
        onPress={() => setReportFormat(fmt)}
        activeOpacity={0.75}
        className={cn(
          "flex-1 flex-row items-center justify-center py-3 rounded-xl border gap-2",
          isActive
            ? "bg-gold-500/10 border-gold-500"
            : "bg-white/5 border-transparent",
        )}
      >
        <Icon
          size={16}
          color={isActive ? colors.gold[500] : colors.text.muted}
        />
        <Typo
          className={cn(
            "font-sans-bold text-xs",
            isActive ? "text-gold-500" : "text-text-muted",
          )}
        >
          {label}
        </Typo>
      </TouchableOpacity>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ModalWrapper title="Notifications" onClose={onBack}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Push notifications ───────────────────────────────────────── */}
        <SectionLabel>Alert Preferences</SectionLabel>
        <View className="bg-ui-card rounded-[24px] px-5 border border-white/5 mb-8">
          <ToggleItem
            icon={BellRing}
            title="Account Activity"
            sub="Real-time alerts for trades and transfers"
            value={settings.transactions}
            onToggle={() => toggle("transactions")}
          />
          <ToggleItem
            icon={ShieldCheck}
            title="Security Alerts"
            sub="Logins and sensitive account changes"
            value={settings.security}
            onToggle={() => toggle("security")}
            isLast
          />
        </View>

        {/* ── Automated reporting ──────────────────────────────────────── */}
        <SectionLabel>Automated Reporting</SectionLabel>
        <View className="bg-ui-card rounded-[24px] px-5 py-2 border border-white/5">
          <ToggleItem
            icon={CalendarDays}
            title="Monthly Report"
            sub="Receive a detailed statement via email"
            value={settings.monthlyReport}
            onToggle={() => toggle("monthlyReport")}
            isLast={!settings.monthlyReport}
          />

          {settings.monthlyReport && (
            <View className="pb-5 pt-4 border-t border-white/5 mt-1 gap-4">
              {/* Format selector */}
              <View>
                <Typo className="text-text-secondary font-mono text-[10px] uppercase tracking-[2px] mb-3">
                  Preferred File Format
                </Typo>
                <View className="flex-row gap-3">
                  <FormatPill fmt="PDF" label="PDF" icon={FileText} />
                  <FormatPill
                    fmt="EXCEL"
                    label="Excel"
                    icon={FileSpreadsheet}
                  />
                </View>
              </View>

              {/* Format description */}
              <View className="bg-brand-900/60 rounded-2xl border border-white/5 px-4 py-3">
                {reportFormat === "PDF" ? (
                  <>
                    <Typo className="text-white font-sans-semibold text-[13px] mb-1">
                      PDF Bank Statement
                    </Typo>
                    <Typo className="text-text-secondary text-[11px] leading-5">
                      A branded, print-ready statement with your logo, summary
                      figures, budget allocation, and full category breakdown —
                      just like a bank statement.
                    </Typo>
                  </>
                ) : (
                  <>
                    <Typo className="text-white font-sans-semibold text-[13px] mb-1">
                      Excel Workbook
                    </Typo>
                    <Typo className="text-text-secondary text-[11px] leading-5">
                      A two-sheet workbook with a financial summary and a full
                      category breakdown — ideal for custom analysis and
                      filtering.
                    </Typo>
                  </>
                )}
              </View>

              {/* Recipient display */}
              {user?.email ? (
                <View className="flex-row items-center gap-3 bg-brand-900/40 rounded-2xl border border-white/5 px-4 py-3">
                  <Send size={14} color={colors.gold[500]} />
                  <View className="flex-1">
                    <Typo className="text-text-muted font-mono text-[9px] uppercase tracking-widest mb-0.5">
                      Sends to
                    </Typo>
                    <Typo className="text-white font-sans-medium text-[13px]">
                      {user.email}
                    </Typo>
                  </View>
                </View>
              ) : (
                <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl px-4 py-3">
                  <Typo className="text-danger-500 font-mono text-[10px] uppercase tracking-widest mb-1">
                    No email on file
                  </Typo>
                  <Typo className="text-text-secondary text-[11px]">
                    Add an email address to your profile to receive reports.
                  </Typo>
                </View>
              )}

              {/* Send now button */}
              <TouchableOpacity
                onPress={() => {
                  // NOTE: Pass real ExportData from your current month's data
                  // In production, connect this to your data store / context
                  // Example: sendReportEmail(currentMonthData)
                  //
                  // For now this shows the architecture — wire it up in the
                  // parent or pass data down as a prop when you integrate.
                  sendReportEmail({
                    month: new Date().toLocaleString("default", {
                      month: "long",
                    }),
                    month_range: "",
                    grandTotal: 0,
                    totalIncome: 0,
                    bucketTotals: {} as any,
                    categoryTotals: {},
                  });
                }}
                activeOpacity={0.75}
                disabled={isSending || !user?.email}
                className={cn(
                  "flex-row items-center justify-center gap-2 py-3.5 rounded-2xl border",
                  isSending || !user?.email
                    ? "bg-white/5 border-white/5 opacity-50"
                    : "bg-gold-500/10 border-gold-500/40",
                )}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color={colors.gold[500]} />
                ) : (
                  <Send size={16} color={colors.gold[500]} />
                )}
                <Typo className="text-gold-500 font-sans-semibold text-[14px]">
                  {isSending
                    ? "Preparing Statement…"
                    : `Send ${reportFormat === "PDF" ? "PDF" : "Excel"} to Email`}
                </Typo>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Typo className="text-text-muted text-[11px] text-center mt-6 px-4 leading-5">
          Reports are generated on the 1st of every month and sent to your
          registered email address. You can also send one manually above.
        </Typo>
      </ScrollView>
    </ModalWrapper>
  );
};

export default Notifications;
