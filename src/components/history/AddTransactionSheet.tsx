import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { colors } from "@/src/constants/colors";
import { BucketType, CATEGORIES } from "@/src/types/finance";
import { Typo, Button } from "../ui";

const AddTransactionSheet = ({ onClose }: { onClose: () => void }) => {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  return (
    <View className="flex-1">
      {/* 1. Large Amount Input */}
      <View className="items-center py-8">
        <Typo variant="muted" className="font-mono-bold text-[10px] uppercase mb-2">Transaction Value</Typo>
        <View className="flex-row items-baseline">
          <Typo className="text-2xl font-serif-bold text-gold-500 mr-2">₹</Typo>
          <TextInput 
            placeholder="0.00"
            placeholderTextColor={colors.text.muted}
            keyboardType="numeric"
            className="text-5xl font-serif-bold text-white min-w-[100px]"
            autoFocus
          />
        </View>
      </View>

      {/* 2. Category Grid */}
      <Typo variant="secondary" className="font-mono-bold text-[10px] uppercase mb-4 tracking-tighter">
        Select Category (Auto-Assigns Bucket)
      </Typo>
      
      <ScrollView showsVerticalScrollIndicator={false} className="max-h-[300px]">
        <View className="flex-row flex-wrap justify-between">
          {Object.entries(CATEGORIES).map(([key, item]) => {
            const isSelected = selectedCat === item.label;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setSelectedCat(item.label)}
                className={`w-[48%] mb-3 p-4 rounded-2xl border ${
                  isSelected ? 'border-gold-500 bg-gold-500/10' : 'border-white/5 bg-ui-input'
                }`}
              >
                <Typo className={`text-xs font-sans-bold ${isSelected ? 'text-white' : 'text-text-secondary'}`}>
                  {item.label}
                </Typo>
                <Typo className={`text-[9px] font-mono-bold uppercase mt-1 ${
                  item.bucket === BucketType.NEEDS ? "text-brand-500" :
                  item.bucket === BucketType.WANTS ? "text-gold-500" : "text-success-500"
                }`}>
                  {item.bucket}
                </Typo>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* 3. Action Button */}
      <Button 
        title="Secure Entry" 
        variant="gold" 
        className="mt-6" 
        onPress={onClose}
      />
    </View>
  );
};

export default AddTransactionSheet;