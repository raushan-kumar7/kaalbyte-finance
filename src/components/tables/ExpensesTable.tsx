import React, { useState } from "react";
import { View, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { Pencil, Trash2, IndianRupee, FileText, CalendarDays } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { colors } from "@/src/constants/colors";
import { BucketType, CATEGORIES } from "@/src/types/finance";
import { Typo } from "../ui";
import { ModalWrapper } from "../shared";
import { dailyEntrySchema } from "@/src/validations/finance";
import { FieldConfig, Form } from "../forms";
import { showToast } from "@/src/utils/toast";
import {ConfirmDeleteModal} from "../modals"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExpenseRow {
  id: string;
  /** ISO date string e.g. "2025-01-15" — used as the editable date value */
  rawDate: string;
  /** Human-readable display date e.g. "15 Jan 2025" — shown in the table */
  date: string;
  category: string;
  description: string;
  amount: number;
  bucket: BucketType;
}

interface ExpensesTableProps {
  entries: ExpenseRow[];
  isLoading?: boolean;
  onUpdateEntry?: (id: string, updates: Partial<ExpenseRow>) => Promise<boolean>;
  onDeleteEntry?: (id: string) => Promise<boolean>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BUCKET_CONFIG: Record<BucketType, { label: string; color: string; bg: string }> = {
  [BucketType.NEEDS]: {
    label: "Need",
    color: colors.success[500],
    bg: `${colors.success[500]}22`,
  },
  [BucketType.WANTS]: {
    label: "Want",
    color: colors.danger[500],
    bg: `${colors.danger[500]}22`,
  },
  [BucketType.SAVINGS]: {
    label: "Save",
    color: colors.gold[500],
    bg: `${colors.gold[500]}22`,
  },
};

const CATEGORY_OPTIONS = Object.values(CATEGORIES).map((c) => ({
  label: c.label,
  value: c.label,
}));

// ─── Edit Modal (mirrors AddDailyExpense structure exactly) ───────────────────

interface EditExpenseModalProps {
  entry: ExpenseRow;
  onSave: (updates: Partial<ExpenseRow>) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

const EditExpenseModal = ({ entry, onSave, onClose, isSaving }: EditExpenseModalProps) => {
  /**
   * Form fields mirror AddDailyExpense — only "date" becomes read-only
   * since editing the date of a historical entry would affect month grouping.
   * We render a disabled Input for date instead of the date field type.
   */
  const formFields: FieldConfig[] = [
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: CATEGORY_OPTIONS,
    },
    {
      name: "amount",
      label: "Amount",
      type: "number",
      placeholder: "0.00",
      icon: IndianRupee,
      iconColor: colors.success[500],
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "What was this for?",
      icon: FileText,
      required: true,
    },
  ];

  const handleSubmit = async (values: any) => {
    const selectedCategory = Object.values(CATEGORIES).find(
      (c) => c.label === values.category,
    );
    await onSave({
      category: values.category,
      description: values.description,
      amount: Number(values.amount),
      bucket: selectedCategory?.bucket ?? entry.bucket,
    });
  };

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <ModalWrapper title="Edit Expense" onClose={onClose}>
        {/* Read-only date chip — shows which entry is being edited */}
        <View className="flex-row items-center gap-3 bg-ui-item rounded-2xl px-4 py-3 border border-ui-border mb-5">
          <CalendarDays size={16} color={colors.text.muted} />
          <View className="flex-1">
            <Typo className="font-mono text-[9px] text-text-muted uppercase tracking-widest mb-0.5">
              Date — read only
            </Typo>
            <Typo className="font-mono text-sm text-white/50">{entry.date}</Typo>
          </View>
          <View className="px-2 py-1 rounded-lg bg-white/5 border border-white/5">
            <Typo className="font-mono text-[9px] text-text-muted uppercase tracking-wider">
              Locked
            </Typo>
          </View>
        </View>

        <Form
          fields={formFields}
          validationSchema={dailyEntrySchema.omit(["date", "bucket", "userId"])}
          defaultValues={{
            category: entry.category,
            amount: String(entry.amount),
            description: entry.description,
          }}
          onSubmit={handleSubmit}
          submitButtonText={isSaving ? "Saving..." : "Save Changes"}
        />
      </ModalWrapper>
    </Modal>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ExpensesTable = ({
  entries,
  isLoading = false,
  onUpdateEntry,
  onDeleteEntry,
}: ExpensesTableProps) => {
  const [editingEntry, setEditingEntry] = useState<ExpenseRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ExpenseRow | null>(null);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSave = async (updates: Partial<ExpenseRow>) => {
    if (!editingEntry || !onUpdateEntry) return;
    setIsSaving(true);
    const success = await onUpdateEntry(editingEntry.id, updates);
    setIsSaving(false);
    if (success) {
      showToast.success("Updated", "Expense updated successfully!");
      setEditingEntry(null);
    } else {
      showToast.error("Error", "Failed to update entry. Please try again.");
    }
  };

  // Opens the custom confirm modal instead of Alert.alert
  const handleDelete = (entry: ExpenseRow) => {
    setPendingDelete(entry);
  };

  // Called when user taps "Yes, Delete" inside ConfirmDeleteModal
  const handleConfirmDelete = async () => {
    if (!pendingDelete || !onDeleteEntry) return;
    setDeletingId(pendingDelete.id);
    const success = await onDeleteEntry(pendingDelete.id);
    setDeletingId(null);
    setPendingDelete(null);
    if (success) {
      showToast.success("Deleted", "Expense removed.");
    } else {
      showToast.error("Error", "Failed to delete entry.");
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color={colors.gold[500]} />
        <Typo variant="muted" className="font-mono text-xs mt-4 uppercase tracking-widest">
          Loading Entries...
        </Typo>
      </View>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <View className="px-6 pb-8">
      {/* ── Section header ──────────────────────────────────────────────────── */}
      <View className="flex-row items-center justify-between mb-4">
        <Typo variant="muted" className="font-mono text-[10px] uppercase tracking-widest">
          All Entries
        </Typo>
        <View className="bg-brand-800 px-3 py-1.5 rounded-xl border border-white/5">
          <Typo className="font-mono text-[10px] text-white/40">
            {entries.length} {entries.length === 1 ? "record" : "records"}
          </Typo>
        </View>
      </View>

      {/* ── Empty state ─────────────────────────────────────────────────────── */}
      {entries.length === 0 ? (
        <View className="bg-brand-800 rounded-[28px] border border-white/5 py-14 items-center">
          <Typo variant="muted" className="font-mono text-sm">
            No entries for this period
          </Typo>
        </View>
      ) : (
        <>
          {/* ── Column labels ─────────────────────────────────────────────── */}
          <View className="flex-row items-center px-4 pb-2 mb-1">
            <Typo
              variant="muted"
              className="font-mono text-[9px] uppercase tracking-widest flex-1"
            >
              Expense
            </Typo>
            <Typo
              variant="muted"
              className="font-mono text-[9px] uppercase tracking-widest w-24 text-right mr-2"
            >
              Amount
            </Typo>
            {/* spacer for action buttons */}
            {(onUpdateEntry || onDeleteEntry) && <View style={{ width: 68 }} />}
          </View>

          {/* ── Rows ──────────────────────────────────────────────────────── */}
          <View className="bg-brand-800 rounded-[28px] border border-white/5 overflow-hidden">
            {entries.map((entry, index) => {
              const bucketCfg = BUCKET_CONFIG[entry.bucket];
              const isDeleting = deletingId === entry.id;
              const isLast = index === entries.length - 1;

              return (
                <View key={entry.id}>
                  <Animated.View
                    entering={FadeInDown.delay(index * 35).duration(280)}
                    className={`flex-row items-center px-4 py-4 ${
                      !isLast ? "border-b border-white/[0.04]" : ""
                    }`}
                  >
                  {/* ── Left: category, description, date ─────────────────── */}
                  <View className="flex-1 mr-2">
                    {/* Row 1: category name + bucket pill */}
                    <View className="flex-row items-center gap-2 mb-0.5 flex-wrap">
                      <Typo className="text-white font-sans-bold text-[13px]">
                        {entry.category}
                      </Typo>
                      <View
                        className="px-2 py-0.5 rounded-lg"
                        style={{ backgroundColor: bucketCfg.bg }}
                      >
                        <Typo
                          className="font-mono text-[8px] uppercase tracking-wider"
                          style={{ color: bucketCfg.color }}
                        >
                          {bucketCfg.label}
                        </Typo>
                      </View>
                    </View>

                    {/* Row 2: description */}
                    <Typo
                      variant="muted"
                      className="text-[11px] font-mono leading-4"
                      numberOfLines={1}
                    >
                      {entry.description}
                    </Typo>

                    {/* Row 3: date */}
                    <Typo
                      className="text-[10px] font-mono mt-0.5"
                      style={{ color: colors.text.muted + "80" }}
                    >
                      {entry.date}
                    </Typo>
                  </View>

                  {/* ── Amount ─────────────────────────────────────────────── */}
                  <Typo className="text-white font-sans-bold text-[15px] w-24 text-right mr-3">
                    ₹{entry.amount.toLocaleString("en-IN")}
                  </Typo>

                  {/* ── Action buttons ─────────────────────────────────────── */}
                  {(onUpdateEntry || onDeleteEntry) && (
                    <View className="flex-row gap-2">
                      {onUpdateEntry && (
                        <TouchableOpacity
                          onPress={() => setEditingEntry(entry)}
                          activeOpacity={0.7}
                          className="w-8 h-8 rounded-xl bg-brand-500/10 border border-brand-500/20 items-center justify-center"
                        >
                          <Pencil size={13} color={colors.brand[500]} />
                        </TouchableOpacity>
                      )}

                      {onDeleteEntry && (
                        <TouchableOpacity
                          onPress={() => handleDelete(entry)}
                          disabled={isDeleting}
                          activeOpacity={0.7}
                          className="w-8 h-8 rounded-xl bg-danger-500/10 border border-danger-500/20 items-center justify-center"
                        >
                          {isDeleting ? (
                            <ActivityIndicator size="small" color={colors.danger[500]} />
                          ) : (
                            <Trash2 size={13} color={colors.danger[500]} />
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </Animated.View>
                </View>
              );
            })}
          </View>
        </>
      )}

      {/* ── Edit Modal ───────────────────────────────────────────────────────── */}
      {editingEntry && (
        <EditExpenseModal
          entry={editingEntry}
          onSave={handleSave}
          onClose={() => !isSaving && setEditingEntry(null)}
          isSaving={isSaving}
        />
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      <ConfirmDeleteModal
        visible={pendingDelete !== null}
        amount={pendingDelete?.amount ?? 0}
        description={pendingDelete?.description ?? ""}
        category={pendingDelete?.category}
        isDeleting={deletingId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => !deletingId && setPendingDelete(null)}
      />
    </View>
  );
};

export default ExpensesTable;