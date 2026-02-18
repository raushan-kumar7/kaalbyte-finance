import React from "react";
import { BucketType, CATEGORIES } from "@/src/types/finance";
import { FileText, IndianRupee } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { dailyEntrySchema } from "@/src/validations/finance";
import { FieldConfig, Form } from "../forms";
import { ModalWrapper } from "../shared";
import { useCreateDailyEntry } from "@/src/hooks";
import { showToast } from "@/src/utils/toast";

interface AddDailyExpenseProps {
  onClose: () => void;
}

const AddDailyExpense = ({ onClose }: AddDailyExpenseProps) => {
  const { createEntry, isLoading } = useCreateDailyEntry();

  const categoryOptions = Object.values(CATEGORIES).map((category) => ({
    label: category.label,
    value: category.label,
  }));

  const formFields: FieldConfig[] = [
    {
      name: "date",
      label: "Date",
      type: "date",
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: categoryOptions,
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

    const finalData = {
      ...values,
      amount: Number(values.amount),
      bucket: selectedCategory?.bucket || BucketType.WANTS,
      date: values.date instanceof Date ? values.date : new Date(values.date),
    };

    const result = await createEntry(finalData);

    if (result.success) {
      showToast.success("Success", "Expense added successfully!");
      onClose();
    } else {
      showToast.error("Error", result.error || "Failed to add expense");
    }
  };

  return (
    <ModalWrapper title="Add Daily Expense" onClose={onClose}>
      <Form
        fields={formFields}
        validationSchema={dailyEntrySchema}
        defaultValues={{
          date: new Date(),
          category: "",
          amount: "",
          description: "",
          bucket: BucketType.WANTS,
        }}
        onSubmit={handleSubmit}
        submitButtonText={isLoading ? "Adding..." : "Add Expense"}
      />
    </ModalWrapper>
  );
};

export default AddDailyExpense;
