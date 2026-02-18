import React from "react";
import { colors } from "@/src/constants/colors";
import { Landmark, IndianRupee, Coins } from "lucide-react-native";
import { goldAssetSchema } from "@/src/validations/finance";
import { ComputedSummary, FieldConfig, Form } from "../forms";
import { ModalWrapper } from "../shared";
import { useCreateDigitalAsset } from "@/src/hooks";
import { DigitalGoldOrSilverAssetType } from "@/src/types/finance";
import { showToast } from "@/src/utils/toast"; // Import Toast

interface AddDigitalGoldSilverTxnProps {
  onClose: () => void;
}

const AddDigitalGoldSilverTxn = ({ onClose }: AddDigitalGoldSilverTxnProps) => {
  const { createAsset, isLoading } = useCreateDigitalAsset();

  const formFields: FieldConfig[] = [
    {
      name: "type",
      label: "Asset Type",
      type: "select",
      options: [
        { label: "Digital Gold", value: DigitalGoldOrSilverAssetType.GOLD },
        { label: "Digital Silver", value: DigitalGoldOrSilverAssetType.SILVER },
      ],
      required: true,
    },
    {
      name: "date",
      label: "Purchase Date",
      type: "date",
      required: true,
    },
    {
      name: "platform",
      label: "Platform / Provider",
      type: "text",
      placeholder: "e.g., MMTC-PAMP, SafeGold",
      icon: Landmark,
      iconColor: colors.text.muted,
      required: true,
    },
    {
      name: "rate_per_gram",
      label: "Rate / Gram",
      type: "number",
      icon: IndianRupee,
      iconColor: colors.gold[500],
      containerClassName: "flex-1",
      required: true,
    },
    {
      name: "amount_paid",
      label: "Amount Paid",
      type: "number",
      icon: Coins,
      iconColor: colors.success[500],
      containerClassName: "flex-1",
      required: true,
    },
    {
      name: "gst_3_percent",
      label: "GST (3%)",
      type: "computed",
      compute: (values) => {
        const amount = parseFloat(values.amount_paid) || 0;
        return Number((amount * 0.03).toFixed(2));
      },
    },
    {
      name: "gold_value",
      label: "Net Asset Value",
      type: "computed",
      compute: (values) => {
        const amount = parseFloat(values.amount_paid) || 0;
        const gst = amount * 0.03;
        return Number((amount - gst).toFixed(2));
      },
    },
    {
      name: "weight_g",
      label: "Weight (g)",
      type: "computed",
      compute: (values) => {
        const amount = parseFloat(values.amount_paid) || 0;
        const rate = parseFloat(values.rate_per_gram) || 0;
        const gst = amount * 0.03;
        const netValue = amount - gst;
        const weight = rate > 0 ? netValue / rate : 0;
        return Number(weight.toFixed(3));
      },
    },
  ];

  const computedSummary: ComputedSummary = {
    fields: [
      {
        label: "GST (3%)",
        key: "gst_3_percent",
        format: (value) => `₹${value || 0}`,
      },
      {
        label: "Net Weight",
        key: "weight_g",
        format: (value) => `${value || 0} g`,
        variant: "gold",
      },
    ],
    totalField: {
      label: "Investment Value",
      key: "gold_value",
      format: (value) => `₹${value || 0}`,
    },
  };

  const handleSubmit = async (data: any) => {
    const finalData = {
      type: data.type as DigitalGoldOrSilverAssetType,
      date: data.date instanceof Date ? data.date : new Date(data.date),
      platform: data.platform,
      ratePerGram: Number(data.rate_per_gram) || 0,
      amountPaid: Number(data.amount_paid) || 0,
      gst3Percent: Number(data.gst_3_percent) || 0,
      weightG: Number(data.weight_g) || 0,
      assetValue: Number(data.gold_value) || 0,
    };

    const result = await createAsset(finalData as any);

    if (result.success) {
      showToast.success("Success", "Asset added successfully");
      onClose();
    } else {
      showToast.error("Error", result.error);
    }
  };

  return (
    <ModalWrapper title="Add Digital Asset" onClose={onClose}>
      <Form
        fields={formFields}
        validationSchema={goldAssetSchema}
        defaultValues={{
          type: DigitalGoldOrSilverAssetType.GOLD,
          date: new Date(),
          platform: "",
          rate_per_gram: "",
          amount_paid: "",
          gst_3_percent: 0,
          weight_g: 0,
          gold_value: 0,
        }}
        onSubmit={handleSubmit}
        submitButtonText={
          isLoading ? "Securing Asset..." : "Securely Add Asset"
        }
        submitButtonColor={colors.gold[500]}
        submitButtonTextColor={colors.brand[900]}
        computedSummary={computedSummary}
        watchFields={["amount_paid", "rate_per_gram"]}
      />
    </ModalWrapper>
  );
};

export default AddDigitalGoldSilverTxn;
