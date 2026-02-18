import React from "react";
import { FieldConfig, Form, ComputedSummary } from "../forms";
import { ModalWrapper } from "../shared";
import { monthlyIncomeSchema } from "@/src/validations/finance";
import { Banknote, PlusCircle, CalendarDays } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { useUpsertMonthlyIncome } from "@/src/hooks";
import { showToast } from "@/src/utils/toast";

interface AddMonthlyIncomeProps {
  onClose: () => void;
}

const AddMonthlyIncome = ({ onClose }: AddMonthlyIncomeProps) => {
  const { upsertIncome, isLoading } = useUpsertMonthlyIncome();

  const formFields: FieldConfig[] = [
    {
      name: "month",
      label: "Income Month",
      type: "month",
      icon: CalendarDays,
      required: true,
    },
    {
      name: "salary",
      label: "Base Salary",
      type: "number",
      placeholder: "0.00",
      icon: Banknote,
      iconColor: colors.success[500],
      required: true,
    },
    {
      name: "other_income",
      label: "Bonus / Other Income",
      type: "number",
      placeholder: "0.00",
      icon: PlusCircle,
      iconColor: colors.gold[500],
    },
    {
      name: "total_income",
      label: "Total Income",
      type: "computed",
      compute: (values) => {
        const sal = parseFloat(values.salary) || 0;
        const other = parseFloat(values.other_income) || 0;
        return sal + other;
      },
    },
  ];

  const computedSummary: ComputedSummary = {
    fields: [
      {
        label: "Base Component",
        key: "salary",
        format: (val) => `₹${val || 0}`,
      },
      {
        label: "Additional Pay",
        key: "other_income",
        format: (val) => `+ ₹${val || 0}`,
        variant: "gold",
      },
    ],
    totalField: {
      label: "Final Net Credit",
      key: "total_income",
      format: (val) => `₹${val || 0}`,
    },
  };

  const handleSubmit = async (data: any) => {
    const incomeData = {
      month: data.month,
      salary: Number(data.salary),
      otherIncome: Number(data.other_income || 0),
      totalIncome: Number(data.total_income),
    };

    const result = await upsertIncome(data.month, incomeData as any);

    if (result.success) {
      showToast.success("Success", `Income for ${data.month} saved.`);
      onClose();
    } else {
      showToast.error("Error", result.error);
    }
  };

  return (
    <ModalWrapper title="Log Monthly Income" onClose={onClose}>
      <Form
        fields={formFields}
        validationSchema={monthlyIncomeSchema}
        defaultValues={{
          month: new Date().toISOString().slice(0, 7),
          salary: "",
          other_income: "",
          total_income: 0,
        }}
        onSubmit={handleSubmit}
        submitButtonText={
          isLoading ? "Processing..." : "Confirm Monthly Credit"
        }
        computedSummary={computedSummary}
        watchFields={["salary", "other_income"]}
      />
    </ModalWrapper>
  );
};

export default AddMonthlyIncome;
