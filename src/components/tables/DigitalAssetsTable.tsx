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
import { Pencil, Trash2, Coins, Milestone, Scale, Check } from "lucide-react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { colors } from "@/src/constants/colors";
import { Typo } from "../ui";
import { DigitalGoldOrSilverAssetType } from "@/src/types/finance";
import {ModalWrapper} from "../shared";

// ─── Types (camelCase — matches actual DB schema) ─────────────────────────────

export interface DigitalAsset {
  id: number;
  userId: string;
  type: DigitalGoldOrSilverAssetType;
  date: Date;
  platform: string;
  ratePerGram: number;
  amountPaid: number;
  gst3Percent: number;
  weightG: number;
  assetValue: number;
}

export interface DigitalAssetsTableProps {
  assets: DigitalAsset[];
  isLoading?: boolean;
  onUpdate: (id: number, updates: Partial<Omit<DigitalAsset, "id" | "userId">>) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

type EditForm = {
  platform: string;
  ratePerGram: string;
  amountPaid: string;
  weightG: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isGold = (t: DigitalGoldOrSilverAssetType) => t === DigitalGoldOrSilverAssetType.GOLD;
const assetColor = (t: DigitalGoldOrSilverAssetType) => isGold(t) ? colors.gold[500] : colors.brand[100];
const assetLabel = (t: DigitalGoldOrSilverAssetType) => isGold(t) ? "Gold" : "Silver";

// ─── Edit Form ────────────────────────────────────────────────────────────────

const EditAssetForm = ({
  form,
  setForm,
  isSaving,
  onSave,
  accent,
}: {
  form: EditForm;
  setForm: React.Dispatch<React.SetStateAction<EditForm>>;
  isSaving: boolean;
  onSave: () => void;
  accent: string;
}) => {
  const fields: { key: keyof EditForm; label: string; prefix?: string; placeholder?: string }[] = [
    { key: "platform",    label: "Platform",      placeholder: "e.g. Zerodha, HDFC" },
    { key: "ratePerGram", label: "Rate per gram",  prefix: "₹" },
    { key: "amountPaid",  label: "Amount paid",    prefix: "₹" },
    { key: "weightG",     label: "Weight (g)",     placeholder: "0.000" },
  ];

  return (
    <View style={{ flex: 1 }}>
      {fields.map(({ key, label, prefix, placeholder }) => (
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
              <Typo className="font-mono text-sm" style={{ color: colors.text.muted, marginRight: 6 }}>
                {prefix}
              </Typo>
            )}
            <TextInput
              value={form[key]}
              onChangeText={(v) => setForm((p) => ({ ...p, [key]: v }))}
              keyboardType={key === "platform" ? "default" : "numeric"}
              style={{ flex: 1, color: colors.text.primary, fontFamily: "FiraCode-Regular", fontSize: 14, paddingVertical: 13 }}
              placeholderTextColor={colors.text.muted}
              placeholder={placeholder ?? "0"}
              editable={!isSaving}
            />
          </View>
        </View>
      ))}

      {/* Live preview row */}
      <View style={{
        backgroundColor: `${accent}10`, borderRadius: 14,
        borderWidth: 1, borderColor: `${accent}20`,
        padding: 14, flexDirection: "row",
        justifyContent: "space-between", alignItems: "center", marginBottom: 24,
      }}>
        <View>
          <Typo className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: colors.text.muted }}>Weight</Typo>
          <Typo className="font-sans-bold text-sm" style={{ color: accent }}>
            {Number(form.weightG || 0).toFixed(3)} g
          </Typo>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Typo className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: colors.text.muted }}>Amount Paid</Typo>
          <Typo className="font-sans-bold text-lg" style={{ color: accent }}>
            ₹{(Number(form.amountPaid) || 0).toLocaleString("en-IN")}
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

const AssetRow = ({
  item, index, onEdit, onDelete,
}: {
  item: DigitalAsset; index: number; onEdit: () => void; onDelete: () => void;
}) => {
  const accent = assetColor(item.type);
  return (
    <Animated.View entering={FadeInDown.delay(index * 55).duration(320)}>
      <View style={{
        backgroundColor: colors.ui.item, borderRadius: 18,
        padding: 16, marginBottom: 10,
        borderWidth: 1, borderColor: "rgba(255,255,255,0.05)",
      }}>
        {/* Top row */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <View style={{
            backgroundColor: `${accent}15`, borderRadius: 10,
            paddingHorizontal: 10, paddingVertical: 4,
            flexDirection: "row", alignItems: "center", gap: 5,
            borderWidth: 1, borderColor: `${accent}25`,
          }}>
            {isGold(item.type)
              ? <Coins size={11} color={accent} strokeWidth={2} />
              : <Milestone size={11} color={accent} strokeWidth={2} />}
            <Typo className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
              {assetLabel(item.type)}
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

        {/* Platform */}
        <Typo className="text-white font-sans-medium text-sm mb-3">{item.platform}</Typo>

        {/* Stats */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          {[
            { label: "Rate/g",  value: `₹${(item.ratePerGram ?? 0).toLocaleString("en-IN")}`, icon: null,                              isAccent: false },
            { label: "Weight",  value: `${(item.weightG ?? 0).toFixed(3)}g`,                   icon: <Scale size={9} color={accent} />, isAccent: false },
            { label: "Paid",    value: `₹${(item.amountPaid ?? 0).toLocaleString("en-IN")}`,   icon: null,                              isAccent: true  },
          ].map(({ label, value, icon, isAccent }) => (
            <View key={label} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 11, padding: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 4 }}>
                {icon}
                <Typo className="font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.text.muted }}>
                  {label}
                </Typo>
              </View>
              <Typo className="font-sans-bold text-xs" style={{ color: isAccent ? assetColor(item.type) : colors.text.primary }}>
                {value}
              </Typo>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const DigitalAssetsTable = ({ assets, isLoading = false, onUpdate, onDelete }: DigitalAssetsTableProps) => {
  const [editTarget, setEditTarget] = useState<DigitalAsset | null>(null);
  const [form, setForm] = useState<EditForm>({ platform: "", ratePerGram: "", amountPaid: "", weightG: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const openEdit = (item: DigitalAsset) => {
    setForm({
      platform:    item.platform    ?? "",
      ratePerGram: String(item.ratePerGram ?? ""),
      amountPaid:  String(item.amountPaid  ?? ""),
      weightG:     String(item.weightG     ?? ""),
    });
    setEditTarget(item);
  };

  const handleSave = async () => {
    if (!editTarget) return;
    setIsSaving(true);
    const ok = await onUpdate(editTarget.id, {
      platform:    form.platform,
      ratePerGram: Number(form.ratePerGram) || 0,
      amountPaid:  Number(form.amountPaid)  || 0,
      weightG:     Number(form.weightG)     || 0,
    });
    setIsSaving(false);
    if (ok) setEditTarget(null);
  };

  const handleDelete = (item: DigitalAsset) => {
    Alert.alert(
      `Delete ${assetLabel(item.type)} Asset?`,
      `Remove ${item.platform} purchase? This cannot be undone.`,
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
      <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: `${colors.gold[500]}12`, alignItems: "center", justifyContent: "center", marginBottom: 12, borderWidth: 1, borderColor: `${colors.gold[500]}20` }}>
        <Coins size={24} color={colors.gold[500]} strokeWidth={1.5} />
      </View>
      <Typo className="text-white font-sans-medium text-sm mb-1">No digital assets yet</Typo>
      <Typo className="font-mono text-[11px]" style={{ color: colors.text.muted }}>Add gold or silver investments</Typo>
    </Animated.View>
  );

  const accent = editTarget ? assetColor(editTarget.type) : colors.gold[500];

  return (
    <>
      <FlatList
        data={assets}
        keyExtractor={(i) => String(i.id)}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <View style={{ opacity: isDeletingId === item.id ? 0.4 : 1 }}>
            <AssetRow item={item} index={index} onEdit={() => openEdit(item)} onDelete={() => handleDelete(item)} />
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
          title={editTarget ? `Edit ${assetLabel(editTarget.type)} Asset` : "Edit Asset"}
          onClose={() => { if (!isSaving) setEditTarget(null); }}
        >
          <EditAssetForm
            form={form}
            setForm={setForm}
            isSaving={isSaving}
            onSave={handleSave}
            accent={accent}
          />
        </ModalWrapper>
      </Modal>
    </>
  );
};

export default DigitalAssetsTable;