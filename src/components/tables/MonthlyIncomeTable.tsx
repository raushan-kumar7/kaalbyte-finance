import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Pencil, Trash2, TrendingUp, Check } from "lucide-react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { colors } from "@/src/constants/colors";
import { Typo } from "../ui";
import { ModalWrapper } from "../shared";
import { showToast } from "@/src/utils/toast";
import { ConfirmDeleteModal } from "../modals";

export interface MonthlyIncomeRow {
  id: number;
  userId?: string;
  month: string;
  salary: number;
  otherIncome: number;
  totalIncome: number;
}

export interface MonthlyIncomeTableProps {
  incomes: MonthlyIncomeRow[];
  isLoading?: boolean;
  onUpdate: (
    id: number,
    updates: Partial<Pick<MonthlyIncomeRow, "salary" | "otherIncome">>,
  ) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

type EditForm = {
  salary: string;
  otherIncome: string;
};

const EditIncomeForm = ({
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
  const total = (Number(form.salary) || 0) + (Number(form.otherIncome) || 0);

  return (
    <View style={{ flex: 1 }}>
      {(["salary", "otherIncome"] as const).map((field) => (
        <View key={field} style={{ marginBottom: 16 }}>
          <Typo
            className="font-mono text-[10px] uppercase tracking-widest mb-2"
            style={{ color: colors.text.muted }}
          >
            {field === "salary" ? "Salary" : "Other Income"}
          </Typo>
          <View
            style={{
              backgroundColor: colors.ui.input,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.06)",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 14,
            }}
          >
            <Typo
              className="font-mono text-sm"
              style={{ color: colors.text.muted, marginRight: 6 }}
            >
              ₹
            </Typo>
            <TextInput
              value={form[field]}
              onChangeText={(v) => setForm((p) => ({ ...p, [field]: v }))}
              keyboardType="numeric"
              style={{
                flex: 1,
                color: colors.text.primary,
                fontFamily: "FiraCode-Regular",
                fontSize: 14,
                paddingVertical: 13,
              }}
              placeholderTextColor={colors.text.muted}
              placeholder="0"
              editable={!isSaving}
            />
          </View>
        </View>
      ))}

      {/* Total live preview */}
      <View
        style={{
          backgroundColor: `${colors.gold[500]}10`,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: `${colors.gold[500]}20`,
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <Typo
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: colors.text.muted }}
        >
          Total Income
        </Typo>
        <Typo
          className="font-sans-bold text-xl"
          style={{ color: colors.gold[500] }}
        >
          ₹{total.toLocaleString("en-IN")}
        </Typo>
      </View>

      <TouchableOpacity
        onPress={onSave}
        disabled={isSaving}
        activeOpacity={0.82}
        style={{
          backgroundColor: colors.brand[500],
          borderRadius: 18,
          paddingVertical: 15,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          opacity: isSaving ? 0.7 : 1,
        }}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Check size={16} color={colors.white} strokeWidth={2.5} />
        )}
        <Typo className="text-white font-sans-bold text-sm">
          {isSaving ? "Saving…" : "Save Changes"}
        </Typo>
      </TouchableOpacity>
    </View>
  );
};

const IncomeRow = ({
  item,
  index,
  onEdit,
  onDelete,
}: {
  item: MonthlyIncomeRow;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <Animated.View entering={FadeInDown.delay(index * 60).duration(320)}>
    <View
      style={{
        backgroundColor: colors.ui.item,
        borderRadius: 18,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      {/* Top row: month chip + actions */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}
      >
        <View
          style={{
            backgroundColor: `${colors.brand[500]}20`,
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderWidth: 1,
            borderColor: `${colors.brand[500]}30`,
          }}
        >
          <Typo
            className="font-mono text-[11px] uppercase tracking-widest"
            style={{ color: colors.brand[100] }}
          >
            {item.month}
          </Typo>
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={onEdit}
          activeOpacity={0.7}
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: `${colors.brand[500]}18`,
            marginRight: 8,
          }}
        >
          <Pencil size={13} color={colors.brand[100]} strokeWidth={1.8} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          activeOpacity={0.7}
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: `${colors.danger[500]}18`,
          }}
        >
          <Trash2 size={13} color={colors.danger[500]} strokeWidth={1.8} />
        </TouchableOpacity>
      </View>

      {/* Breakdown */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        {[
          {
            label: "Salary",
            value: item.salary,
            color: colors.success[500],
            bold: false,
          },
          {
            label: "Other",
            value: item.otherIncome,
            color: colors.gold[500],
            bold: false,
          },
          {
            label: "Total",
            value: item.totalIncome,
            color: colors.white,
            bold: true,
          },
        ].map(({ label, value, color, bold }) => (
          <View
            key={label}
            style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.03)",
              borderRadius: 12,
              padding: 10,
            }}
          >
            <Typo
              className="font-mono text-[9px] uppercase tracking-widest mb-1"
              style={{ color: colors.text.muted }}
            >
              {label}
            </Typo>
            <Typo
              className={`text-sm ${bold ? "font-sans-bold" : "font-sans-medium"}`}
              style={{ color }}
            >
              ₹{(value ?? 0).toLocaleString("en-IN")}
            </Typo>
          </View>
        ))}
      </View>
    </View>
  </Animated.View>
);

const MonthlyIncomeTable = ({
  incomes,
  isLoading = false,
  onUpdate,
  onDelete,
}: MonthlyIncomeTableProps) => {
  const [editTarget, setEditTarget] = useState<MonthlyIncomeRow | null>(null);
  const [form, setForm] = useState<EditForm>({ salary: "", otherIncome: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MonthlyIncomeRow | null>(
    null,
  );

  const openEdit = (item: MonthlyIncomeRow) => {
    setForm({
      salary: String(item.salary ?? 0),
      otherIncome: String(item.otherIncome ?? 0),
    });
    setEditTarget(item);
  };

  const handleSave = async () => {
    if (!editTarget) return;
    setIsSaving(true);
    const ok = await onUpdate(editTarget.id, {
      salary: Number(form.salary) || 0,
      otherIncome: Number(form.otherIncome) || 0,
    });
    setIsSaving(false);
    if (ok) {
      showToast.success("Updated", "Income record saved.");
      setEditTarget(null);
    } else {
      showToast.error("Error", "Failed to update income.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeletingId(pendingDelete.id);
    const ok = await onDelete(pendingDelete.id);
    setIsDeletingId(null);
    setPendingDelete(null);
    if (ok) {
      showToast.success("Deleted", "Income record removed.");
    } else {
      showToast.error("Error", "Failed to delete income.");
    }
  };

  if (isLoading)
    return (
      <View style={{ padding: 40, alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.gold[500]} />
      </View>
    );

  if (!incomes.length)
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        style={{ alignItems: "center", padding: 40 }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 18,
            backgroundColor: `${colors.gold[500]}12`,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            borderWidth: 1,
            borderColor: `${colors.gold[500]}20`,
          }}
        >
          <TrendingUp size={24} color={colors.gold[500]} strokeWidth={1.5} />
        </View>
        <Typo className="text-white font-sans-medium text-sm mb-1">
          No income records
        </Typo>
        <Typo
          className="font-mono text-[11px]"
          style={{ color: colors.text.muted }}
        >
          Add your first monthly income
        </Typo>
      </Animated.View>
    );

  return (
    <>
      <FlatList
        data={incomes}
        keyExtractor={(i) => String(i.id)}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <View style={{ opacity: isDeletingId === item.id ? 0.4 : 1 }}>
            <IncomeRow
              item={item}
              index={index}
              onEdit={() => openEdit(item)}
              onDelete={() => setPendingDelete(item)}
            />
          </View>
        )}
      />

      {/* ── Edit Modal ────────────────────────────────────────────────────── */}
      <Modal
        visible={!!editTarget}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => {
          if (!isSaving) setEditTarget(null);
        }}
      >
        <ModalWrapper
          title={`Edit Income · ${editTarget?.month ?? ""}`}
          onClose={() => {
            if (!isSaving) setEditTarget(null);
          }}
        >
          <EditIncomeForm
            form={form}
            setForm={setForm}
            isSaving={isSaving}
            onSave={handleSave}
          />
        </ModalWrapper>
      </Modal>

      {/* ── Delete Confirm Modal ──────────────────────────────────────────── */}
      <ConfirmDeleteModal
        visible={pendingDelete !== null}
        amount={pendingDelete?.totalIncome ?? 0}
        description={`Income for ${pendingDelete?.month ?? ""}`}
        category={`Salary ₹${(pendingDelete?.salary ?? 0).toLocaleString("en-IN")} · Other ₹${(pendingDelete?.otherIncome ?? 0).toLocaleString("en-IN")}`}
        isDeleting={isDeletingId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeletingId) setPendingDelete(null);
        }}
      />
    </>
  );
};

export default MonthlyIncomeTable;
