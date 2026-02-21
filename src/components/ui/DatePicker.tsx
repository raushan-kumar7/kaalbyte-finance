import React, { useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import Input from "./Input";

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (date: string) => void;
  error?: string;
  placeholder?: string;
}

const DatePicker = ({
  label,
  value,
  onChange,
  error,
  placeholder,
}: DatePickerProps) => {
  const [show, setShow] = useState(false);

  // Convert string YYYY-MM-DD to Date object for the picker
  const dateValue = value ? new Date(value) : new Date();

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    // Hide picker for Android immediately after selection
    if (Platform.OS === "android") setShow(false);

    if (selectedDate) {
      // Format to YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split("T")[0];
      onChange(formattedDate);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShow(true)} activeOpacity={0.7}>
        {/* PointerEvents="none" ensures the TouchableOpacity handles the tap, not the Input */}
        <View pointerEvents="none">
          <Input
            label={label}
            placeholder={placeholder || "YYYY-MM-DD"}
            value={value}
            error={error}
            leftIcon={<Calendar size={18} color={colors.text.secondary} />}
          />
        </View>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

export default DatePicker;
