// import React, { useState, useEffect } from "react";
// import {
//   View,
//   ScrollView,
//   TouchableOpacity,
//   Switch,
//   Alert,
// } from "react-native";
// import * as LocalAuthentication from "expo-local-authentication";
// import { ModalWrapper } from "../shared";
// import {
//   KeyRound,
//   Fingerprint,
//   Smartphone,
//   ShieldAlert,
//   History,
//   ChevronRight,
// } from "lucide-react-native";
// import { colors } from "@/src/constants/colors";
// import { User } from "@/src/types/user";
// import { Typo } from "../ui";
// import { ChangePassword, SessionActivity } from "../auth";
// import { getTimeAgo } from "@/src/utils/date";

// interface SecurityProps {
//   user: User | null;
//   onBack: () => void;
// }

// const Security = ({ user, onBack }: SecurityProps) => {
//   const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
//   const [is2FAEnabled, setIs2FAEnabled] = useState(false);
//   const [isHardwareSupport, setIsHardwareSupport] = useState(false);
//   const [view, setView] = useState<"main" | "password" | "activity">("main");

//   const handleBack = () => (view !== "main" ? setView("main") : onBack());

//   // Check if device supports Biometrics on mount
//   useEffect(() => {
//     (async () => {
//       const compatible = await LocalAuthentication.hasHardwareAsync();
//       setIsHardwareSupport(compatible);
//     })();
//   }, []);

//   const handleBiometricToggle = async () => {
//     if (isBiometricEnabled) {
//       setIsBiometricEnabled(false);
//       return;
//     }

//     const hasRecords = await LocalAuthentication.isEnrolledAsync();

//     if (!hasRecords) {
//       return Alert.alert(
//         "Not Setup",
//         "No biometrics found on this device. Please set up FaceID/Fingerprint in your phone settings.",
//       );
//     }

//     const result = await LocalAuthentication.authenticateAsync({
//       promptMessage: "Verify your identity",
//       fallbackLabel: "Use Passcode",
//       disableDeviceFallback: false,
//     });

//     if (result.success) {
//       setIsBiometricEnabled(true);
//     } else {
//       Alert.alert("Authentication Failed", "Could not verify your identity.");
//     }
//   };

//   const SecurityItem = ({
//     icon: Icon,
//     title,
//     subTitle,
//     onPress,
//     toggleValue,
//     onToggle,
//     disabled = false,
//   }: any) => (
//     <TouchableOpacity
//       activeOpacity={toggleValue !== undefined ? 1 : 0.7}
//       onPress={onPress}
//       disabled={disabled}
//       className={`flex-row items-center py-5 px-4 bg-white/5 rounded-3xl mb-4 border border-white/5 ${disabled ? "opacity-40" : ""}`}
//     >
//       <View className="w-12 h-12 rounded-2xl bg-gold-500/10 items-center justify-center">
//         <Icon size={22} color={colors.gold[500]} />
//       </View>

//       <View className="flex-1 ml-4">
//         <Typo className="text-white font-sans-bold text-[15px]">{title}</Typo>
//         <Typo className="text-text-secondary font-sans text-[12px] mt-0.5">
//           {subTitle}
//         </Typo>
//       </View>

//       {toggleValue !== undefined ? (
//         <Switch
//           value={toggleValue}
//           onValueChange={onToggle}
//           trackColor={{ false: "#333", true: colors.gold[500] }}
//           thumbColor={toggleValue ? "#fff" : "#888"}
//           ios_backgroundColor="#333"
//         />
//       ) : (
//         <ChevronRight size={18} color={colors.text.muted} />
//       )}
//     </TouchableOpacity>
//   );

//   const passwordSubtitle = user?.passwordLastChangedAt
//     ? getTimeAgo(user.passwordLastChangedAt)
//     : "Not changed recently";

//   return (
//     <ModalWrapper
//       title={view === "password" ? "Change Password" : "Profile Security"}
//       onClose={handleBack}
//     >
//       {view === "main" ? (
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 40 }}
//         >
//           {/* --- STATUS HEADER --- */}
//           <View className="items-center my-6">
//             <View className="w-20 h-20 rounded-full bg-success-500/10 items-center justify-center border-2 border-success-500/20">
//               <ShieldAlert size={40} color={colors.success[500]} />
//             </View>
//             <Typo className="text-white font-serif-bold text-xl mt-4">
//               Security Score: High
//             </Typo>
//             <Typo className="text-text-secondary font-mono text-[10px] uppercase tracking-widest mt-1">
//               {`${user?.firstName}'s account is well protected`}
//             </Typo>
//           </View>

//           {/* --- ACCESS CONTROL --- */}
//           <Typo className="text-text-secondary font-mono-bold text-[11px] uppercase tracking-[2px] mb-4 ml-2">
//             Access Control
//           </Typo>

//           <SecurityItem
//             icon={Fingerprint}
//             title="Biometric Login"
//             subTitle={
//               isHardwareSupport
//                 ? "FaceID or Fingerprint"
//                 : "Hardware not supported"
//             }
//             toggleValue={isBiometricEnabled}
//             onToggle={handleBiometricToggle}
//             disabled={!isHardwareSupport}
//           />

//           <SecurityItem
//             icon={Smartphone}
//             title="Two-Factor Auth"
//             subTitle="Secure via SMS or Authenticator"
//             toggleValue={is2FAEnabled}
//             onToggle={() => setIs2FAEnabled(!is2FAEnabled)}
//           />

//           {/* --- ACCOUNT PROTECTION --- */}
//           <Typo className="text-text-secondary font-mono-bold text-[11px] uppercase tracking-[2px] mt-4 mb-4 ml-2">
//             Account Protection
//           </Typo>

//           <SecurityItem
//             icon={KeyRound}
//             title="Change Password"
//             subTitle={passwordSubtitle}
//             onPress={() => setView("password")}
//           />

//           <SecurityItem
//             icon={History}
//             title="Session Activity"
//             subTitle="Check active sessions and devices"
//             onPress={() => setView("activity")}
//           />

//           <TouchableOpacity
//             activeOpacity={0.7}
//             className="mt-6 flex-row items-center justify-center py-4 rounded-2xl border border-white/5"
//           >
//             <Typo className="text-text-muted font-sans-medium text-[13px]">
//               Privacy Policy & Security Terms
//             </Typo>
//           </TouchableOpacity>
//         </ScrollView>
//       ) : view === "password" ? (
//         <ChangePassword onSuccess={() => setView("main")} />
//       ) : (
//         <SessionActivity />
//       )}
//     </ModalWrapper>
//   );
// };

// export default Security;

import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { ModalWrapper } from "../shared";
import {
  KeyRound,
  Fingerprint,
  Smartphone,
  ShieldAlert,
  History,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { User } from "@/src/types/user";
import { Typo } from "../ui";
import { ChangePassword, SessionActivity } from "../auth";
import { getTimeAgo } from "@/src/utils/date";
import { useAuth } from "@/src/hooks/useAuth";

interface SecurityProps {
  user: User | null;
  onBack: () => void;
}

const Security = ({ user, onBack }: SecurityProps) => {
  const { isBiometricEnabled, enableBiometrics, disableBiometrics, isLoading } =
    useAuth();

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isHardwareSupport, setIsHardwareSupport] = useState(false);
  const [view, setView] = useState<"main" | "password" | "activity">("main");

  // Password modal state (cross-platform alternative to Alert.prompt)
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const handleBack = () => (view !== "main" ? setView("main") : onBack());

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsHardwareSupport(compatible);
    })();
  }, []);

  const handleBiometricToggle = async () => {
    // --- Turning OFF ---
    if (isBiometricEnabled) {
      Alert.alert(
        "Disable Biometric Login",
        "Are you sure you want to turn off biometric sign-in?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Disable",
            style: "destructive",
            onPress: async () => {
              try {
                await disableBiometrics();
              } catch (e: any) {
                Alert.alert("Error", e.message);
              }
            },
          },
        ],
      );
      return;
    }

    // --- Turning ON: check hardware first ---
    const hasRecords = await LocalAuthentication.isEnrolledAsync();
    if (!hasRecords) {
      return Alert.alert(
        "Not Setup",
        "No biometrics found on this device. Please set up FaceID or Fingerprint in your phone settings.",
      );
    }

    // Show password confirmation modal (works on both iOS & Android)
    setPasswordInput("");
    setShowPasswordModal(true);
  };

  const handleConfirmEnableBiometrics = async () => {
    if (!passwordInput.trim()) {
      Alert.alert("Required", "Please enter your password to continue.");
      return;
    }
    setModalLoading(true);
    try {
      await enableBiometrics(passwordInput);
      setShowPasswordModal(false);
      setPasswordInput("");
    } catch (e: any) {
      Alert.alert("Failed", e.message || "Could not enable biometric login.");
    } finally {
      setModalLoading(false);
    }
  };

  const SecurityItem = ({
    icon: Icon,
    title,
    subTitle,
    onPress,
    toggleValue,
    onToggle,
    disabled = false,
  }: any) => (
    <TouchableOpacity
      activeOpacity={toggleValue !== undefined ? 1 : 0.7}
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center py-5 px-4 bg-white/5 rounded-3xl mb-4 border border-white/5 ${disabled ? "opacity-40" : ""}`}
    >
      <View className="w-12 h-12 rounded-2xl bg-gold-500/10 items-center justify-center">
        <Icon size={22} color={colors.gold[500]} />
      </View>

      <View className="flex-1 ml-4">
        <Typo className="text-white font-sans-bold text-[15px]">{title}</Typo>
        <Typo className="text-text-secondary font-sans text-[12px] mt-0.5">
          {subTitle}
        </Typo>
      </View>

      {toggleValue !== undefined ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: "#333", true: colors.gold[500] }}
          thumbColor={toggleValue ? "#fff" : "#888"}
          ios_backgroundColor="#333"
        />
      ) : (
        <ChevronRight size={18} color={colors.text.muted} />
      )}
    </TouchableOpacity>
  );

  const passwordSubtitle = user?.passwordLastChangedAt
    ? getTimeAgo(user.passwordLastChangedAt)
    : "Not changed recently";

  return (
    <>
      <ModalWrapper
        title={
          view === "password"
            ? "Change Password"
            : view === "activity"
              ? "Session Activity"
              : "Profile Security"
        }
        onClose={handleBack}
      >
        {view === "main" ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* --- STATUS HEADER --- */}
            <View className="items-center my-6">
              <View className="w-20 h-20 rounded-full bg-success-500/10 items-center justify-center border-2 border-success-500/20">
                <ShieldAlert size={40} color={colors.success[500]} />
              </View>
              <Typo className="text-white font-serif-bold text-xl mt-4">
                Security Score: High
              </Typo>
              <Typo className="text-text-secondary font-mono text-[10px] uppercase tracking-widest mt-1">
                {`${user?.firstName}'s account is well protected`}
              </Typo>
            </View>

            {/* --- ACCESS CONTROL --- */}
            <Typo className="text-text-secondary font-mono-bold text-[11px] uppercase tracking-[2px] mb-4 ml-2">
              Access Control
            </Typo>

            <SecurityItem
              icon={Fingerprint}
              title="Biometric Signin"
              subTitle={
                !isHardwareSupport
                  ? "Hardware not supported"
                  : isBiometricEnabled
                    ? "Tap to disable Fingerprint"
                    : "Enable Fingerprint"
              }
              toggleValue={isBiometricEnabled}
              onToggle={handleBiometricToggle}
              disabled={!isHardwareSupport || isLoading}
            />

            <SecurityItem
              icon={Smartphone}
              title="Two-Factor Auth"
              subTitle="Secure via SMS or Authenticator"
              toggleValue={is2FAEnabled}
              onToggle={() => setIs2FAEnabled(!is2FAEnabled)}
            />

            {/* --- ACCOUNT PROTECTION --- */}
            <Typo className="text-text-secondary font-mono-bold text-[11px] uppercase tracking-[2px] mt-4 mb-4 ml-2">
              Account Protection
            </Typo>

            <SecurityItem
              icon={KeyRound}
              title="Change Password"
              subTitle={passwordSubtitle}
              onPress={() => setView("password")}
            />

            <SecurityItem
              icon={History}
              title="Session Activity"
              subTitle="Check active sessions and devices"
              onPress={() => setView("activity")}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              className="mt-6 flex-row items-center justify-center py-4 rounded-2xl border border-white/5"
            >
              <Typo className="text-text-muted font-sans-medium text-[13px]">
                Privacy Policy & Security Terms
              </Typo>
            </TouchableOpacity>
          </ScrollView>
        ) : view === "password" ? (
          <ChangePassword onSuccess={() => setView("main")} />
        ) : (
          <SessionActivity />
        )}
      </ModalWrapper>

      {/* ─── Password Confirmation Modal (cross-platform) ─── */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View className="flex-1 bg-black/70 items-center justify-center px-6">
          <View className="w-full bg-brand-800 rounded-3xl p-6 border border-white/10">
            {/* Header */}
            <Typo className="text-white font-serif-bold text-xl mb-1">
              Enable Biometric Login
            </Typo>
            <Typo className="text-text-secondary font-sans text-[13px] mb-6">
              Enter your current password to confirm and securely store your
              credentials.
            </Typo>

            {/* Password Input */}
            <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 mb-6">
              <TextInput
                value={passwordInput}
                onChangeText={setPasswordInput}
                placeholder="Enter your password"
                placeholderTextColor={colors.text.muted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 text-white font-sans text-[15px] py-4"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={18} color={colors.text.muted} />
                ) : (
                  <Eye size={18} color={colors.text.muted} />
                )}
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <View className="flex-row justify-between gap-3">
              <TouchableOpacity
                onPress={() => {
                  setShowPasswordModal(false);
                  setPasswordInput("");
                }}
                disabled={modalLoading}
                className="flex-1 border border-white/10 py-4 rounded-2xl items-center"
              >
                <Typo className="text-white font-sans-bold">Cancel</Typo>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmEnableBiometrics}
                disabled={modalLoading || !passwordInput.trim()}
                className={`flex-1 bg-gold-500 py-4 rounded-2xl items-center ${
                  !passwordInput.trim() ? "opacity-50" : ""
                }`}
              >
                {modalLoading ? (
                  <ActivityIndicator color={colors.brand[900]} />
                ) : (
                  <Typo className="text-brand-900 font-sans-bold">Enable</Typo>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Security;
