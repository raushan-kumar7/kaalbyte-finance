import React from "react";
import { colors } from "@/src/constants/colors";
import { Building2, IndianRupee, Hash } from "lucide-react-native";
import { equityAssetSchema } from "@/src/validations/finance";
import { Exchange } from "@/src/types/finance";
import { ComputedSummary, FieldConfig, Form } from "../forms";
import { ModalWrapper } from "../shared";
import { useCreateEquityAsset } from "@/src/hooks";
import { showToast } from "@/src/utils/toast";

interface AddEquityTxnProps {
  onClose: () => void;
}

const AddEquityTxn = ({ onClose }: AddEquityTxnProps) => {
  const { createAsset, isLoading } = useCreateEquityAsset();

  const formFields: FieldConfig[] = [
    {
      name: "date",
      label: "Purchase Date",
      type: "date",
      required: true,
    },
    {
      name: "company",
      label: "Company Name",
      type: "text",
      placeholder: "e.g., Reliance Industries",
      icon: Building2,
      iconColor: colors.text.muted,
      required: true,
    },
    {
      name: "exchange",
      label: "Exchange",
      type: "select",
      required: true,
      options: [
        { label: "NSE", value: Exchange.NSE },
        { label: "BSE", value: Exchange.BSE },
      ],
    },
    {
      name: "price_per_share",
      label: "Price / Share",
      type: "number",
      icon: IndianRupee,
      iconColor: colors.success[500],
      containerClassName: "flex-1",
      required: true,
    },
    {
      name: "total_shares",
      label: "Total Shares",
      type: "number",
      icon: Hash,
      iconColor: colors.text.muted,
      containerClassName: "flex-1",
      required: true,
    },
    {
      name: "total_amount",
      label: "Total Amount",
      type: "computed",
      compute: (values) => {
        const price = parseFloat(values.price_per_share) || 0;
        const shares = parseFloat(values.total_shares) || 0;
        return Number((price * shares).toFixed(2));
      },
    },
  ];

  const computedSummary: ComputedSummary = {
    fields: [
      {
        label: "Price per Share",
        key: "price_per_share",
        format: (value) => `₹${value || 0}`,
        variant: "default",
      },
      {
        label: "Total Shares",
        key: "total_shares",
        format: (value) => `${value || 0} shares`,
        variant: "gold",
      },
    ],
    totalField: {
      label: "Total Investment",
      key: "total_amount",
      format: (value) => `₹${value || 0}`,
    },
  };

  const handleSubmit = async (data: any) => {
    const finalData = {
      date: data.date instanceof Date ? data.date : new Date(data.date),
      company: data.company,
      exchange: data.exchange as Exchange,
      pricePerShare: Number(data.price_per_share),
      totalShares: Number(data.total_shares),
      totalAmount: Number(data.total_amount),
    };

    const result = await createAsset(finalData as any);

    if (result.success) {
      showToast.success("Equity Added", `Successfully added ${data.company}`);
      onClose();
    } else {
      showToast.error("Error", result.error || "Failed to add equity asset");
    }
  };

  return (
    <ModalWrapper title="Add Equity Asset" onClose={onClose}>
      <Form
        fields={formFields}
        validationSchema={equityAssetSchema}
        defaultValues={{
          date: new Date(),
          company: "",
          exchange: Exchange.NSE,
          price_per_share: "",
          total_shares: "",
          total_amount: 0,
        }}
        onSubmit={handleSubmit}
        submitButtonText={isLoading ? "Adding..." : "Add to Portfolio"}
        submitButtonColor={colors.success[500]}
        submitButtonTextColor={colors.white}
        computedSummary={computedSummary}
        watchFields={["price_per_share", "total_shares"]}
      />
    </ModalWrapper>
  );
};

export default AddEquityTxn;
