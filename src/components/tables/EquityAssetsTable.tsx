import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { Pencil, Trash2, TrendingUp, Check } from "lucide-react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { colors } from "@/src/constants/colors";
import { Typo } from "../ui";
import { Exchange } from "@/src/types/finance";
import {ModalWrapper} from "../shared";

// ─── Types (camelCase — matches actual DB schema) ─────────────────────────────

export interface EquityAsset {
  id: number;
  userId: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  company: string;
  exchange: Exchange;
  pricePerShare: number;
  totalShares: number;
  totalAmount: number;
}

export interface EquityAssetsTableProps {
  assets: EquityAsset[];
  isLoading?: boolean;
  onUpdate: (id: number, updates: Partial<Omit<EquityAsset, "id" | "userId" | "createdAt" | "updatedAt">>) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

type EditForm = {
  company: string;
  exchange: Exchange;
  pricePerShare: string;
  totalShares: string;
  totalAmount: string;
};

// ─── Exchange Selector ────────────────────────────────────────────────────────

const ExchangeTag = ({
  exchange,
  selected,
  onPress,
}: {
  exchange: Exchange;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={{
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: selected ? colors.success[500] : "rgba(255,255,255,0.05)",
      borderWidth: 1,
      borderColor: selected ? `${colors.success[500]}60` : "rgba(255,255,255,0.07)",
    }}
  >
    <Typo
      className="font-mono-bold text-xs uppercase tracking-widest"
      style={{ color: selected ? colors.brand[900] : colors.text.muted }}
    >
      {exchange.toUpperCase()}
    </Typo>
  </TouchableOpacity>
);

// ─── Edit Form ────────────────────────────────────────────────────────────────

const EditEquityForm = ({
  form,
  setForm,
  isSaving,
  onSave,
}: {
  form: EditForm;
  setForm: React.Dispatch<React.SetStateAction<EditForm>>;
  isSaving: boolean;
  onSave: () => void;
}) => {
  const numFields: { key: keyof EditForm; label: string; prefix?: string; isInt?: boolean }[] = [
    { key: "pricePerShare", label: "Price per share", prefix: "₹" },
    { key: "totalShares",   label: "Total shares",    isInt: true },
    { key: "totalAmount",   label: "Total amount",    prefix: "₹" },
  ];

  const totalPreview = (Number(form.pricePerShare) || 0) * (Number(form.totalShares) || 0);

  return (
    <View style={{ flex: 1 }}>
      {/* Company */}
      <View style={{ marginBottom: 16 }}>
        <Typo className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: colors.text.muted }}>
          Company
        </Typo>
        <View style={{
          backgroundColor: colors.ui.input, borderRadius: 14,
          borderWidth: 1, borderColor: "rgba(255,255,255,0.06)", paddingHorizontal: 14,
        }}>
          <TextInput
            value={form.company}
            onChangeText={(v) => setForm((p) => ({ ...p, company: v }))}
            style={{ color: colors.text.primary, fontFamily: "FiraCode-Regular", fontSize: 14, paddingVertical: 13 }}
            placeholderTextColor={colors.text.muted}
            placeholder="Company name"
            editable={!isSaving}
          />
        </View>
      </View>

      {/* Exchange */}
      <View style={{ marginBottom: 16 }}>
        <Typo className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: colors.text.muted }}>
          Exchange
        </Typo>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {Object.values(Exchange).map((ex) => (
            <ExchangeTag
              key={ex}
              exchange={ex}
              selected={form.exchange === ex}
              onPress={() => !isSaving && setForm((p) => ({ ...p, exchange: ex }))}
            />
          ))}
        </View>
      </View>

      {/* Numeric fields */}
      {numFields.map(({ key, label, prefix, isInt }) => (
        <View key={key} style={{ marginBottom: 16 }}>
          <Typo className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: colors.text.muted }}>
            {label}
          </Typo>
          <View style={{
            backgroundColor: colors.ui.input, borderRadius: 14,
            borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
            flexDirection: "row", alignItems: "center", paddingHorizontal: 14,
          }}>
            {prefix && (
              <Typo className="font-mono text-sm" style={{ color: colors.text.muted, marginRight: 6 }}>{prefix}</Typo>
            )}
            <TextInput
              value={form[key] as string}
              onChangeText={(v) => setForm((p) => ({ ...p, [key]: v }))}
              keyboardType={isInt ? "number-pad" : "numeric"}
              style={{ flex: 1, color: colors.text.primary, fontFamily: "FiraCode-Regular", fontSize: 14, paddingVertical: 13 }}
              placeholderTextColor={colors.text.muted}
              placeholder="0"
              editable={!isSaving}
            />
          </View>
        </View>
      ))}

      {/* Live preview */}
      <View style={{
        backgroundColor: `${colors.success[500]}0D`, borderRadius: 14,
        borderWidth: 1, borderColor: `${colors.success[500]}20`,
        padding: 14, flexDirection: "row",
        justifyContent: "space-between", alignItems: "center", marginBottom: 24,
      }}>
        <View>
          <Typo className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: colors.text.muted }}>Shares</Typo>
          <Typo className="font-sans-bold text-sm" style={{ color: colors.success[500] }}>
            {Number(form.totalShares) || 0}
          </Typo>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Typo className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: colors.text.muted }}>Calc. Value</Typo>
          <Typo className="font-sans-bold text-lg" style={{ color: colors.success[500] }}>
            ₹{totalPreview.toLocaleString("en-IN")}
          </Typo>
        </View>
      </View>

      <TouchableOpacity
        onPress={onSave} disabled={isSaving} activeOpacity={0.82}
        style={{
          backgroundColor: colors.brand[500], borderRadius: 18,
          paddingVertical: 15, alignItems: "center", justifyContent: "center",
          flexDirection: "row", gap: 8, opacity: isSaving ? 0.7 : 1,
        }}
      >
        {isSaving
          ? <ActivityIndicator size="small" color={colors.white} />
          : <Check size={16} color={colors.white} strokeWidth={2.5} />}
        <Typo className="text-white font-sans-bold text-sm">
          {isSaving ? "Saving…" : "Save Changes"}
        </Typo>
      </TouchableOpacity>
    </View>
  );
};

// ─── Row ──────────────────────────────────────────────────────────────────────

const EquityRow = ({
  item, index, onEdit, onDelete,
}: {
  item: EquityAsset; index: number; onEdit: () => void; onDelete: () => void;
}) => (
  <Animated.View entering={FadeInDown.delay(index * 55).duration(320)}>
    <View style={{
      backgroundColor: colors.ui.item, borderRadius: 18,
      padding: 16, marginBottom: 10,
      borderWidth: 1, borderColor: "rgba(255,255,255,0.05)",
    }}>
      {/* Top row */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <View style={{
          backgroundColor: `${colors.success[500]}15`, borderRadius: 10,
          paddingHorizontal: 8, paddingVertical: 4,
          borderWidth: 1, borderColor: `${colors.success[500]}25`,
        }}>
          <Typo className="font-mono text-[10px] uppercase tracking-widest" style={{ color: colors.success[500] }}>
            {(item.exchange ?? "").toUpperCase()}
          </Typo>
        </View>
        <Typo className="font-mono text-[10px] ml-2" style={{ color: colors.text.muted }}>
          {new Date(item.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
        </Typo>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={onEdit} activeOpacity={0.7}
          style={{ width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: `${colors.brand[500]}18`, marginRight: 8 }}
        >
          <Pencil size={13} color={colors.brand[100]} strokeWidth={1.8} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete} activeOpacity={0.7}
          style={{ width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: `${colors.danger[500]}18` }}
        >
          <Trash2 size={13} color={colors.danger[500]} strokeWidth={1.8} />
        </TouchableOpacity>
      </View>

      {/* Company */}
      <Typo className="text-white font-sans-bold text-base mb-3">{item.company}</Typo>

      {/* Stats */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        {[
          { label: "Price/share", value: `₹${(item.pricePerShare ?? 0).toLocaleString("en-IN")}`, accent: false },
          { label: "Shares",      value: String(item.totalShares ?? 0),                            accent: false },
          { label: "Invested",    value: `₹${(item.totalAmount ?? 0).toLocaleString("en-IN")}`,    accent: true  },
        ].map(({ label, value, accent }) => (
          <View key={label} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 11, padding: 10 }}>
            <Typo className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: colors.text.muted }}>
              {label}
            </Typo>
            <Typo className="font-sans-bold text-xs" style={{ color: accent ? colors.success[500] : colors.text.primary }}>
              {value}
            </Typo>
          </View>
        ))}
      </View>
    </View>
  </Animated.View>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const EquityAssetsTable = ({ assets, isLoading = false, onUpdate, onDelete }: EquityAssetsTableProps) => {
  const [editTarget, setEditTarget] = useState<EquityAsset | null>(null);
  const [form, setForm] = useState<EditForm>({
    company: "", exchange: Exchange.NSE,
    pricePerShare: "", totalShares: "", totalAmount: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const openEdit = (item: EquityAsset) => {
    setForm({
      company:       item.company       ?? "",
      exchange:      item.exchange      ?? Exchange.NSE,
      pricePerShare: String(item.pricePerShare ?? ""),
      totalShares:   String(item.totalShares   ?? ""),
      totalAmount:   String(item.totalAmount   ?? ""),
    });
    setEditTarget(item);
  };

  const handleSave = async () => {
    if (!editTarget) return;
    setIsSaving(true);
    const ok = await onUpdate(editTarget.id, {
      company:       form.company,
      exchange:      form.exchange,
      pricePerShare: Number(form.pricePerShare) || 0,
      totalShares:   Number(form.totalShares)   || 0,
      totalAmount:   Number(form.totalAmount)   || 0,
    });
    setIsSaving(false);
    if (ok) setEditTarget(null);
  };

  const handleDelete = (item: EquityAsset) => {
    Alert.alert(
      "Delete Equity Asset?",
      `Remove ${item.company} holding? This cannot be undone.`,
      [
        { text: "Keep", style: "cancel" },
        {
          text: "Delete", style: "destructive",
          onPress: async () => {
            setIsDeletingId(item.id);
            await onDelete(item.id);
            setIsDeletingId(null);
          },
        },
      ]
    );
  };

  if (isLoading) return (
    <View style={{ padding: 40, alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.gold[500]} />
    </View>
  );

  if (!assets.length) return (
    <Animated.View entering={FadeIn.duration(300)} style={{ alignItems: "center", padding: 40 }}>
      <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: `${colors.success[500]}12`, alignItems: "center", justifyContent: "center", marginBottom: 12, borderWidth: 1, borderColor: `${colors.success[500]}20` }}>
        <TrendingUp size={24} color={colors.success[500]} strokeWidth={1.5} />
      </View>
      <Typo className="text-white font-sans-medium text-sm mb-1">No equity assets yet</Typo>
      <Typo className="font-mono text-[11px]" style={{ color: colors.text.muted }}>Add stock or mutual fund holdings</Typo>
    </Animated.View>
  );

  return (
    <>
      <FlatList
        data={assets}
        keyExtractor={(i) => String(i.id)}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <View style={{ opacity: isDeletingId === item.id ? 0.4 : 1 }}>
            <EquityRow item={item} index={index} onEdit={() => openEdit(item)} onDelete={() => handleDelete(item)} />
          </View>
        )}
      />

      <Modal
        visible={!!editTarget}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => { if (!isSaving) setEditTarget(null); }}
      >
        <ModalWrapper
          title={`Edit ${editTarget?.company ?? "Equity"}`}
          onClose={() => { if (!isSaving) setEditTarget(null); }}
        >
          <EditEquityForm
            form={form}
            setForm={setForm}
            isSaving={isSaving}
            onSave={handleSave}
          />
        </ModalWrapper>
      </Modal>
    </>
  );
};

export default EquityAssetsTable;