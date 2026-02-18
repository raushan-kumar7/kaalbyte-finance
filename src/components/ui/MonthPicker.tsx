import React, { useState } from "react";
import { View, TouchableOpacity, Modal, Pressable } from "react-native";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import Typo from "./Typo";

interface MonthPickerProps {
  value: string; // YYYY-MM
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

const MonthPicker = ({ value, onChange, label, error }: MonthPickerProps) => {
  const [show, setShow] = useState(false);
  const [viewYear, setViewYear] = useState(parseInt(value.split("-")[0]));

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const handleSelect = (monthIndex: number) => {
    const formattedMonth = (monthIndex + 1).toString().padStart(2, "0");
    onChange(`${viewYear}-${formattedMonth}`);
    setShow(false);
  };

  const selectedMonth = parseInt(value.split("-")[1]) - 1;
  const selectedYear = parseInt(value.split("-")[0]);

  return (
    <View className="gap-y-2">
      {label && (
        <Typo variant="muted" className="text-xs uppercase font-mono ml-1">
          {label}
        </Typo>
      )}

      <TouchableOpacity
        onPress={() => setShow(true)}
        activeOpacity={0.7}
        className={`flex-row items-center bg-ui-input border ${error ? "border-red-500" : "border-white/5"} rounded-2xl px-4 py-4`}
      >
        <Calendar size={18} color={colors.text.muted} />
        <Typo className="flex-1 text-base ml-2">
          {months[selectedMonth]} {selectedYear}
        </Typo>
      </TouchableOpacity>
      {error && <Typo className="text-red-500 text-[10px] ml-1">{error}</Typo>}

      <Modal visible={show} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/60 justify-center px-6"
          onPress={() => setShow(false)}
        >
          <View
            className="bg-brand-900 border border-white/10 rounded-[32px] p-6 overflow-hidden"
            onStartShouldSetResponder={() => true}
          >
            {/* Year Selector Header */}
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity
                onPress={() => setViewYear((v) => v - 1)}
                className="p-2"
              >
                <ChevronLeft color={colors.gold[500]} />
              </TouchableOpacity>
              <Typo className="text-xl font-serif-bold">{viewYear}</Typo>
              <TouchableOpacity
                onPress={() => setViewYear((v) => v + 1)}
                className="p-2"
              >
                <ChevronRight color={colors.gold[500]} />
              </TouchableOpacity>
            </View>

            {/* Months Grid */}
            <View className="flex-row flex-wrap justify-between">
              {months.map((m, i) => {
                const isCurrent =
                  i === selectedMonth && viewYear === selectedYear;
                return (
                  <TouchableOpacity
                    key={m}
                    onPress={() => handleSelect(i)}
                    className={`w-[30%] aspect-square items-center justify-center rounded-2xl mb-3 ${isCurrent ? "bg-gold-500" : "bg-white/5"}`}
                  >
                    <Typo
                      className={`font-mono-bold ${isCurrent ? "text-brand-900" : "text-white"}`}
                    >
                      {m}
                    </Typo>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default MonthPicker;
