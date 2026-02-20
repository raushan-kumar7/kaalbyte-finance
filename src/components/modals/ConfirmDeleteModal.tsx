import React, { useEffect } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Trash2, AlertTriangle, X } from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/src/constants/colors";
import { Typo } from "../ui";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConfirmDeleteModalProps {
  visible: boolean;
  amount: number;
  description: string;
  category?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// ─── Pulsing icon ─────────────────────────────────────────────────────────────

const PulsingIcon = () => {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.15, { duration: 650 }), withTiming(1, { duration: 650 })),
      -1,
      false,
    );
  }, [scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      style={[
        style,
        {
          width: 36,
          height: 36,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `${colors.danger[500]}18`,
          borderWidth: 1,
          borderColor: `${colors.danger[500]}30`,
        },
      ]}
    >
      <Trash2 size={17} color={colors.danger[500]} strokeWidth={1.8} />
    </Animated.View>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const ConfirmDeleteModal = ({
  visible,
  amount,
  description,
  category,
  isDeleting = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Animated.View
        entering={FadeIn.duration(180)}
        exiting={FadeOut.duration(160)}
        style={{ flex: 1, backgroundColor: "rgba(1,5,40,0.82)", justifyContent: "flex-end" }}
      >
        <Pressable
          style={{ position: "absolute", inset: 0 }}
          onPress={isDeleting ? undefined : onCancel}
        />

        <Animated.View
          entering={SlideInDown.springify().damping(24).stiffness(220)}
          exiting={SlideOutDown.duration(200)}
          style={{
            backgroundColor: colors.ui.card,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderTopWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
            paddingBottom: 36,
            paddingHorizontal: 20,
            paddingTop: 12,
          }}
        >
          {/* Drag handle */}
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <View style={{ width: 36, height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.12)" }} />
          </View>

          {/* ── Header row: icon + title + close ─────────────────────── */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
            <PulsingIcon />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Typo className="text-white font-serif-bold text-xl leading-tight">
                Delete Entry?
              </Typo>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 }}>
                <AlertTriangle size={10} color={colors.danger[500]} strokeWidth={2} />
                <Typo
                  className="font-mono text-[9px] uppercase tracking-widest"
                  style={{ color: colors.danger[500] }}
                >
                  Cannot be undone
                </Typo>
              </View>
            </View>
            <TouchableOpacity
              onPress={onCancel}
              disabled={isDeleting}
              activeOpacity={0.7}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            >
              <X size={14} color={colors.text.muted} />
            </TouchableOpacity>
          </View>

          {/* ── Entry preview ────────────────────────────────────────── */}
          <View
            style={{
              backgroundColor: colors.ui.item,
              borderRadius: 16,
              padding: 14,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: `${colors.danger[500]}18`,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Left: rupee + amount */}
            <View style={{ alignItems: "flex-end" }}>
              <Typo
                className="font-serif-bold text-2xl"
                style={{ color: colors.danger[500], lineHeight: 28 }}
              >
                ₹{amount.toLocaleString("en-IN")}
              </Typo>
            </View>

            {/* Divider */}
            <View style={{ width: 1, height: 36, backgroundColor: "rgba(255,255,255,0.07)" }} />

            {/* Right: description + category */}
            <View style={{ flex: 1 }}>
              <Typo
                className="font-sans-medium text-[13px]"
                style={{ color: colors.text.primary }}
                numberOfLines={1}
              >
                {description}
              </Typo>
              {category && (
                <Typo
                  className="font-mono text-[10px] uppercase tracking-widest mt-0.5"
                  style={{ color: colors.text.muted }}
                >
                  {category}
                </Typo>
              )}
            </View>
          </View>

          {/* ── Buttons ──────────────────────────────────────────────── */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            {/* Cancel */}
            <TouchableOpacity
              onPress={onCancel}
              disabled={isDeleting}
              activeOpacity={0.7}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 18,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            >
              <Typo
                className="font-sans-medium text-sm"
                style={{ color: colors.text.secondary }}
              >
                Keep
              </Typo>
            </TouchableOpacity>

            {/* Delete */}
            <TouchableOpacity
              onPress={onConfirm}
              disabled={isDeleting}
              activeOpacity={0.82}
              style={{
                flex: 1.6,
                paddingVertical: 14,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 7,
                backgroundColor: isDeleting ? `${colors.danger[500]}55` : colors.danger[500],
              }}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Trash2 size={14} color={colors.white} strokeWidth={2} />
              )}
              <Typo className="text-white font-sans-bold text-sm">
                {isDeleting ? "Deleting..." : "Delete"}
              </Typo>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default ConfirmDeleteModal;