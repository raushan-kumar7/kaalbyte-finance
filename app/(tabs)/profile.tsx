import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Image, Modal } from "react-native";
import {
  ScreenWrapper,
  PersonalDetails,
  Security,
  Notifications,
  PrivacyPolicy,
  Typo,
} from "@/src/components";
import {
  User as UserIcon,
  ShieldCheck,
  Bell,
  ChevronRight,
  LogOut,
  CircleUserRound,
} from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { useAuth } from "@/src/hooks/useAuth";
import { showToast } from "@/src/utils/toast";

const Profile = () => {
  const { user, signout } = useAuth();
  const [activeModal, setActiveModal] = useState<
    "details" | "security" | "notifications" | "privacy" | null
  >(null);

  const handleSignOut = async () => {
    try {
      await signout();
      showToast.success("You have been successfully logged out.", "Securely Signed Out");
    } catch (error: any) {
      showToast.error(error?.message || "Failed to sign out. Please try again.", "Error");
    }
  };

  const MenuLink = ({
    icon: Icon,
    label,
    subLabel,
    isLast = false,
    onPress,
  }: any) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center py-4 ${!isLast ? "border-b border-white/5" : ""}`}
    >
      <View className="w-10 h-10 rounded-xl bg-brand-500/10 items-center justify-center">
        <Icon size={20} color={colors.gold[500]} />
      </View>
      <View className="flex-1 ml-4">
        <Typo className="text-white font-sans-semibold text-[15px]">
          {label}
        </Typo>
        {subLabel && (
          <Typo className="text-text-secondary font-sans text-[12px]">
            {subLabel}
          </Typo>
        )}
      </View>
      <ChevronRight size={18} color={colors.text.muted} />
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper className="px-0">
      {/* --- FIXED TOP SECTION (Sticky) --- */}
      <View className="bg-brand-900 pt-4">
        <View className="items-center py-6 px-6">
          <View className="relative">
            <View className="w-24 h-24 rounded-full border-2 border-gold-500 p-1">
              {user?.avatar ? (
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <View className="w-full h-full rounded-full bg-ui-card items-center justify-center">
                  <CircleUserRound
                    size={60}
                    color={colors.brand[100]}
                    strokeWidth={1}
                  />
                </View>
              )}
            </View>
          </View>

          <Typo className="text-white font-serif-bold text-2xl mt-4">
            {user?.firstName} {user?.lastName}
          </Typo>
          <Typo className="text-gold-500 font-mono text-[12px] tracking-widest uppercase mt-1">
            @{user?.username}
          </Typo>
        </View>
        <View className="h-[1px] bg-white/5 mx-6" />
      </View>

      {/* --- SCROLLABLE CONTENT --- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
      >
        <View className="px-6">
          <Typo className="text-text-secondary font-mono-bold text-[11px] uppercase tracking-widest mb-4">
            Account Management
          </Typo>
          <View className="bg-ui-card rounded-[24px] px-4 border border-white/5">
            {/* Click to open Personal Details */}
            <MenuLink
              onPress={() => setActiveModal("details")}
              icon={UserIcon}
              label="Personal Details"
              subLabel="Name, Email, Phone"
            />
            <MenuLink
              onPress={() => setActiveModal("security")}
              icon={ShieldCheck}
              label="Security"
              subLabel="2FA, Password"
              isLast
            />
          </View>
        </View>

        {/* Remaining Sections... */}
        <View className="px-6 mt-8">
          <Typo className="text-text-secondary font-mono-bold text-[11px] uppercase tracking-widest mb-4">
            Preferences
          </Typo>
          <View className="bg-ui-card rounded-[24px] px-4 border border-white/5">
            <MenuLink
              onPress={() => setActiveModal("notifications")}
              icon={Bell}
              label="Notifications"
            />
            <MenuLink
              onPress={() => setActiveModal("privacy")}
              icon={ShieldCheck}
              label="Privacy Policy"
              isLast
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleSignOut} className="mx-6 mt-10 flex-row items-center justify-center bg-danger-500/10 py-4 rounded-2xl border border-danger-500/20">
          <LogOut size={18} color={colors.danger[500]} />
          <Typo className="text-danger-500 font-sans-bold ml-2">
            Sign Out
          </Typo>
        </TouchableOpacity>
      </ScrollView>

      {/* --- PERSONAL DETAILS MODAL --- */}
      <Modal
        visible={activeModal === "details"}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveModal(null)}
      >
        <PersonalDetails user={user} onBack={() => setActiveModal(null)} />
      </Modal>

      <Modal
        visible={activeModal === "security"}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveModal(null)}
      >
        <Security user={user} onBack={() => setActiveModal(null)} />
      </Modal>

      <Modal
        visible={activeModal === "notifications"}
        animationType="slide"
        transparent
      >
        <Notifications onBack={() => setActiveModal(null)} />
      </Modal>
      <Modal
        visible={activeModal === "privacy"}
        animationType="slide"
        transparent
      >
        <PrivacyPolicy onBack={() => setActiveModal(null)} />
      </Modal>
    </ScreenWrapper>
  );
};

export default Profile;
