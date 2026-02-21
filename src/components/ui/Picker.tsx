import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { cn } from "@/src/utils/cn";
import { colors } from "@/src/constants/colors";
import { X, Search } from "lucide-react-native";
import Typo from "./Typo";

interface PickerOption {
  label: string;
  value: string | number;
}

interface PickerProps {
  visible: boolean;
  onClose: () => void;
  options: PickerOption[];
  selectedValue?: string | number;
  onSelect: (value: string | number) => void;
  title?: string;
}

const Picker = ({
  visible,
  onClose,
  options,
  selectedValue,
  onSelect,
  title = "Select an option",
}: PickerProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelect = (value: string | number) => {
    onSelect(value);
    setSearchQuery("");
    onClose();
  };

  // --- Sorting & Filtering Logic ---
  const processedOptions = useMemo(() => {
    // 1. Sort Alphabetically
    const sorted = [...options].sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
    );

    // 2. Filter by Search Query
    if (!searchQuery.trim()) return sorted;

    return sorted.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [options, searchQuery]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/70 justify-end" onPress={onClose}>
        <Pressable className="bg-brand-800 rounded-t-[40px] max-h-[85%]">
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-white/5">
            <Typo className="text-xl font-serif-bold">{title}</Typo>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 items-center justify-center bg-white/5 rounded-full"
            >
              <X size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Search Input Layer */}
          <View className="px-6 pt-4 pb-2">
            <View className="flex-row items-center bg-ui-input rounded-2xl px-4 h-14 border border-white/5">
              <Search size={18} color={colors.text.muted} />
              <TextInput
                className="flex-1 ml-3 text-white font-sans text-base"
                placeholder="Search..."
                placeholderTextColor={colors.text.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <X size={16} color={colors.text.muted} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* List Section */}
          <ScrollView
            className="px-6 py-4"
            showsVerticalScrollIndicator={false}
          >
            {processedOptions.length > 0 ? (
              processedOptions.map((option, index) => {
                const isSelected = selectedValue === option.value;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelect(option.value)}
                    className={cn(
                      "py-4 px-5 rounded-[22px] mb-3 flex-row justify-between items-center",
                      isSelected
                        ? "bg-success-500/10 border border-success-500/30"
                        : "bg-white/5",
                    )}
                  >
                    <Typo
                      className={cn(
                        "text-base",
                        isSelected
                          ? "text-success-500 font-sans-bold"
                          : "text-white",
                      )}
                    >
                      {option.label}
                    </Typo>
                    {isSelected && (
                      <View className="w-2 h-2 rounded-full bg-success-500 shadow-sm shadow-success-500" />
                    )}
                  </TouchableOpacity>
                );
              })
            ) : (
              <View className="py-20 items-center">
                <Typo
                  variant="muted"
                  className="text-center font-mono text-xs uppercase tracking-widest"
                >
                  No matching results
                </Typo>
              </View>
            )}
            <View className="h-10" />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default Picker;
