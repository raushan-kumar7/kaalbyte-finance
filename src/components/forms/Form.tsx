import React, { useEffect, useRef, useMemo, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { colors } from "@/src/constants/colors";
import { LucideIcon } from "lucide-react-native";
import { DatePicker, Input, MonthPicker, Select, Typo } from "../ui";

// Updated Field type definitions to include "month"
export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "date"
  | "month"
  | "select"
  | "textarea"
  | "computed";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  icon?: LucideIcon;
  iconColor?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string | number }>;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  multiline?: boolean;
  numberOfLines?: number;
  containerClassName?: string;
  compute?: (formValues: any) => any;
  format?: (value: any) => string;
  variant?: "default" | "success" | "warning" | "gold";
}

export interface ComputedSummary {
  fields: Array<{
    label: string;
    key: string;
    format?: (value: any) => string;
    variant?: "default" | "success" | "warning" | "gold";
  }>;
  totalField?: {
    label: string;
    key: string;
    format?: (value: any) => string;
  };
}

interface FormProps {
  fields: FieldConfig[];
  validationSchema?: any;
  defaultValues?: Record<string, any>;
  onSubmit: (data: any) => void;
  submitButtonText?: string;
  submitButtonColor?: string;
  submitButtonTextColor?: string;
  computedSummary?: ComputedSummary;
  watchFields?: string[];
  onValuesChange?: (values: any) => void;
}

const Form: React.FC<FormProps> = ({
  fields,
  validationSchema,
  defaultValues = {},
  onSubmit,
  submitButtonText = "Submit",
  submitButtonColor = colors.gold[500],
  submitButtonTextColor = colors.brand[900],
  computedSummary,
  watchFields = [],
  onValuesChange,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    defaultValues,
  });

  const computedFields = useMemo(
    () => fields.filter((field) => field.type === "computed"),
    [fields],
  );

  const regularFields = useMemo(
    () => fields.filter((field) => field.type !== "computed"),
    [fields],
  );

  const previousComputedValues = useRef<Record<string, any>>({});
  const allFormValues = watch();
  const watchedValues = watch(watchFields.length > 0 ? watchFields : []);

  const getVariantColor = useCallback((variant?: string) => {
    switch (variant) {
      case "success":
        return colors.success[500];
      case "warning":
        return colors.text.secondary;
      case "gold":
        return colors.gold[500];
      default:
        return colors.text.primary;
    }
  }, []);

  useEffect(() => {
    if (watchFields.length > 0 && onValuesChange) {
      onValuesChange(watchedValues);
    }

    computedFields.forEach((field) => {
      if (field.compute) {
        const computedValue = field.compute(allFormValues);
        const previousValue = previousComputedValues.current[field.name];

        if (previousValue !== computedValue) {
          previousComputedValues.current[field.name] = computedValue;
          setValue(field.name, computedValue, {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false,
          });
        }
      }
    });
  }, [allFormValues, computedFields, setValue, onValuesChange, watchedValues, watchFields.length]);

  const handleFormSubmit = useCallback(
    (data: any) => {
      onSubmit(data);
      reset();
      previousComputedValues.current = {};
    },
    [onSubmit, reset],
  );

  const renderField = useCallback(
    (field: FieldConfig) => {
      const Icon = field.icon;

      switch (field.type) {
        case "date":
          return (
            <Controller
              key={field.name}
              control={control}
              name={field.name}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label={field.label}
                  value={
                    value instanceof Date
                      ? value.toISOString().split("T")[0]
                      : value
                  }
                  onChange={(dateString) => onChange(new Date(dateString))}
                  error={errors[field.name]?.message as string}
                />
              )}
            />
          );

        case "month": // Added MonthPicker Case
          return (
            <Controller
              key={field.name}
              control={control}
              name={field.name}
              render={({ field: { onChange, value } }) => (
                <MonthPicker
                  label={field.label}
                  value={value}
                  onChange={onChange}
                  error={errors[field.name]?.message as string}
                />
              )}
            />
          );

        case "select":
          return (
            <Controller
              key={field.name}
              control={control}
              name={field.name}
              render={({ field: { onChange, value } }) => (
                <Select
                  label={field.label}
                  value={value}
                  onValueChange={onChange}
                  options={field.options || []}
                  error={errors[field.name]?.message as string}
                />
              )}
            />
          );

        case "textarea":
          return (
            <Controller
              key={field.name}
              control={control}
              name={field.name}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={field.label}
                  placeholder={field.placeholder}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value?.toString()}
                  error={errors[field.name]?.message as string}
                  multiline={true}
                  numberOfLines={field.numberOfLines || 4}
                  containerClassName={field.containerClassName}
                />
              )}
            />
          );

        case "number":
          return (
            <Controller
              key={field.name}
              control={control}
              name={field.name}
              render={({ field: { onChange, value } }) => (
                <Input
                  label={field.label}
                  placeholder={field.placeholder}
                  keyboardType="numeric"
                  onChangeText={onChange}
                  value={value?.toString()}
                  error={errors[field.name]?.message as string}
                  leftIcon={
                    Icon ? (
                      <Icon
                        size={16}
                        color={field.iconColor || colors.text.muted}
                      />
                    ) : undefined
                  }
                  containerClassName={field.containerClassName}
                />
              )}
            />
          );

        case "computed":
          return null;

        default:
          return (
            <Controller
              key={field.name}
              control={control}
              name={field.name}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={field.label}
                  placeholder={field.placeholder}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors[field.name]?.message as string}
                  keyboardType={field.keyboardType || "default"}
                  secureTextEntry={field.type === "password"}
                  leftIcon={
                    Icon ? (
                      <Icon
                        size={18}
                        color={field.iconColor || colors.text.muted}
                      />
                    ) : undefined
                  }
                  containerClassName={field.containerClassName}
                />
              )}
            />
          );
      }
    },
    [control, errors],
  );

  const renderComputedSummary = () => {
    if (!computedSummary) return null;

    return (
      <View className="bg-ui-input/40 rounded-[32px] p-6 border border-white/5 gap-y-4">
        {computedSummary.fields.map((summaryField, index) => {
          const value = allFormValues[summaryField.key];
          const displayValue = summaryField.format
            ? summaryField.format(value)
            : value?.toString() || "0";

          return (
            <View key={index} className="flex-row justify-between items-center">
              <Typo variant="muted" className="text-xs font-mono uppercase">
                {summaryField.label}
              </Typo>
              <Typo
                className="font-mono-bold"
                style={{ color: getVariantColor(summaryField.variant) }}
              >
                {displayValue}
              </Typo>
            </View>
          );
        })}

        {computedSummary.totalField && (
          <>
            <View className="h-[1px] bg-white/5 w-full my-1" />
            <View className="flex-row justify-between items-center">
              <Typo className="text-sm font-serif-bold uppercase">
                {computedSummary.totalField.label}
              </Typo>
              <Typo className="text-success-500 font-mono-bold text-xl">
                {computedSummary.totalField.format
                  ? computedSummary.totalField.format(
                      allFormValues[computedSummary.totalField.key],
                    )
                  : allFormValues[computedSummary.totalField.key]?.toString() ||
                    "0"}
              </Typo>
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={{ gap: 20 }}>
          {regularFields.map((field) => renderField(field))}

          {renderComputedSummary()}

          <TouchableOpacity
            onPress={handleSubmit(handleFormSubmit)}
            className="py-5 rounded-[24px] items-center shadow-xl mt-4"
            style={{
              backgroundColor: submitButtonColor,
              shadowColor: submitButtonColor,
              shadowOpacity: 0.3,
            }}
          >
            <Typo
              className="font-sans-bold text-base"
              style={{ color: submitButtonTextColor }}
            >
              {submitButtonText}
            </Typo>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Form;