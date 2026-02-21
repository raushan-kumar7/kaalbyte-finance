import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Camera, ShieldCheck } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { User, Gender } from "@/src/types/user";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileUpdateSchema } from "@/src/validations/user";
import { ModalWrapper } from "../shared";
import { DatePicker, Image, Input, Select, Typo } from "../ui";
import { showToast } from "@/src/utils/toast";
import { useUser } from "@/src/hooks/useUser";

interface PersonalDetailsProps {
  user: User | null;
  onBack: () => void;
}

const PersonalDetails = ({ user: propUser, onBack }: PersonalDetailsProps) => {
  const { user: hookUser, updateProfile, updateAvatar, isLoading } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const currentUser = hookUser || propUser;

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileUpdateSchema),
    defaultValues: {
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      phone: currentUser?.phone || "",
      gender: currentUser?.gender || Gender.OTHER,
      dateOfBirth: currentUser?.dateOfBirth || "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      reset({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        phone: currentUser.phone || "",
        gender: currentUser.gender || Gender.OTHER,
        dateOfBirth: currentUser.dateOfBirth || "",
      });
    }
  }, [currentUser, reset]);

  const handlePicker = async () => {
    if (!isEditing) {
      showToast.info(
        "Edit Mode Required",
        "Please tap 'Edit Profile' to change your photo.",
      );
      return;
    }

    try {
      // The updateAvatar logic usually includes picking the file
      await updateAvatar();

      showToast.success("Success", "Your profile picture has been updated.");
    } catch (error: any) {
      // Only show error if the user didn't manually cancel the picker
      if (error?.message !== "User cancelled image selection") {
        showToast.error(
          "Upload Failed",
          "We couldn't update your photo. Please try again.",
        );
      }
    }
  };

  const onSave = async (data: any) => {
    try {
      await updateProfile(data);

      // Success Toast
      showToast.success(
        "Profile Updated",
        "Your personal details have been saved successfully.",
      );

      setIsEditing(false);
    } catch (error: any) {
      console.error("Update failed", error);

      // Error Toast
      showToast.error(
        "Update Failed",
        error?.message || "Something went wrong while saving your details.",
      );
    }
  };

  const genderOptions = [
    { label: "Male", value: Gender.MALE },
    { label: "Female", value: Gender.FEMALE },
    { label: "Other", value: Gender.OTHER },
  ];

  return (
    <ModalWrapper
      title={isEditing ? "Edit Details" : "Personal Details"}
      onClose={
        isEditing
          ? () => {
              setIsEditing(false);
              reset();
            }
          : onBack
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* --- PROFILE IMAGE --- */}
        <View className="items-center mt-2 mb-10">
          <View className="relative">
            <View className="w-28 h-28 rounded-full border-2 border-gold-500/30 p-1">
              <View className="w-full h-full rounded-full bg-ui-card items-center justify-center overflow-hidden border border-white/10">
                {isLoading ? (
                  <ActivityIndicator color={colors.gold[500]} />
                ) : currentUser?.avatar ? (
                  <Image
                    source={{ uri: currentUser.avatar }}
                    className="w-full h-full"
                  />
                ) : (
                  <Typo className="text-gold-500 text-3xl font-serif-bold">
                    {currentUser?.firstName?.[0] || "U"}
                  </Typo>
                )}
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePicker}
              disabled={isLoading}
              className="absolute bottom-1 right-1 bg-gold-500 p-2.5 rounded-full border-4 border-brand-800 shadow-lg"
            >
              <Camera size={16} color={colors.brand[900]} />
            </TouchableOpacity>
          </View>

          {isEditing && (
            <Typo className="text-gold-500 text-[10px] mt-2 uppercase font-mono-bold">
              {isLoading ? "Uploading..." : "Tap camera to change"}
            </Typo>
          )}
        </View>

        {/* --- DATA FIELDS --- */}
        <View>
          <View className="flex-row justify-between">
            <View className="w-[48%]">
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-5">
                    {!isEditing ? (
                      <View>
                        <Typo className="text-text-secondary font-mono-bold text-[10px] uppercase tracking-[2px] mb-2 px-1">
                          First Name
                        </Typo>
                        <View className="bg-white/5 rounded-2xl border border-white/5 px-4 py-4">
                          <Typo className="text-white font-sans-medium text-[15px]">
                            {value}
                          </Typo>
                        </View>
                      </View>
                    ) : (
                      <Input
                        label="First Name"
                        value={value}
                        onChangeText={onChange}
                        error={errors.firstName?.message}
                      />
                    )}
                  </View>
                )}
              />
            </View>
            <View className="w-[48%]">
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-5">
                    {!isEditing ? (
                      <View>
                        <Typo className="text-text-secondary font-mono-bold text-[10px] uppercase tracking-[2px] mb-2 px-1">
                          Last Name
                        </Typo>
                        <View className="bg-white/5 rounded-2xl border border-white/5 px-4 py-4">
                          <Typo className="text-white font-sans-medium text-[15px]">
                            {value}
                          </Typo>
                        </View>
                      </View>
                    ) : (
                      <Input
                        label="Last Name"
                        value={value}
                        onChangeText={onChange}
                        error={errors.lastName?.message}
                      />
                    )}
                  </View>
                )}
              />
            </View>
          </View>

          <View className="mb-5">
            <Typo className="text-text-secondary font-mono-bold text-[10px] uppercase tracking-[2px] mb-2 px-1">
              Username
            </Typo>
            <View className="bg-white/5 rounded-2xl border border-white/5 px-4 py-4 flex-row justify-between items-center">
              <Typo className="text-white/50 font-sans-medium text-[15px]">
                @{currentUser?.username?.toLowerCase()}
              </Typo>
              <View className="flex-row items-center">
                <Typo className="text-success-500 font-mono-bold text-[8px] uppercase mr-1">
                  Verified
                </Typo>
                <ShieldCheck size={12} color={colors.success[500]} />
              </View>
            </View>
          </View>

          <View className="mb-5">
            <Typo className="text-text-secondary font-mono-bold text-[10px] uppercase tracking-[2px] mb-2 px-1">
              Email Address
            </Typo>
            <View className="bg-white/5 rounded-2xl border border-white/5 px-4 py-4 flex-row justify-between items-center">
              <Typo className="text-white/50 font-sans-medium text-[15px]">
                {currentUser?.email?.toLowerCase()}
              </Typo>
              <View className="flex-row items-center">
                <Typo className="text-success-500 font-mono-bold text-[8px] uppercase mr-1">
                  Verified
                </Typo>
                <ShieldCheck size={12} color={colors.success[500]} />
              </View>
            </View>
          </View>

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <View className="mb-5">
                {!isEditing ? (
                  <View>
                    <Typo className="text-text-secondary font-mono-bold text-[10px] uppercase tracking-[2px] mb-2 px-1">
                      Phone Number
                    </Typo>
                    <View className="bg-white/5 rounded-2xl border border-white/5 px-4 py-4">
                      <Typo className="text-white font-sans-medium text-[15px]">
                        {value || "Not provided"}
                      </Typo>
                    </View>
                  </View>
                ) : (
                  <Input
                    label="Phone Number"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                    error={errors.phone?.message}
                  />
                )}
              </View>
            )}
          />

          <View className="flex-row justify-between">
            <View className="w-[48%]">
              <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-5">
                    {!isEditing ? (
                      <View>
                        <Typo className="text-text-secondary font-mono-bold text-[10px] uppercase tracking-[2px] mb-2 px-1">
                          Gender
                        </Typo>
                        <View className="bg-white/5 rounded-2xl border border-white/5 px-4 py-4">
                          <Typo className="text-white font-sans-medium text-[15px] capitalize">
                            {value}
                          </Typo>
                        </View>
                      </View>
                    ) : (
                      <Select
                        label="Gender"
                        value={value}
                        options={genderOptions}
                        onValueChange={onChange}
                      />
                    )}
                  </View>
                )}
              />
            </View>
            <View className="w-[48%]">
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-5">
                    {!isEditing ? (
                      <View>
                        <Typo className="text-text-secondary font-mono-bold text-[10px] uppercase tracking-[2px] mb-2 px-1">
                          Birth Date
                        </Typo>
                        <View className="bg-white/5 rounded-2xl border border-white/5 px-4 py-4">
                          <Typo className="text-white font-sans-medium text-[15px]">
                            {value || "Not provided"}
                          </Typo>
                        </View>
                      </View>
                    ) : (
                      <DatePicker
                        label="Birth Date"
                        value={value || ""}
                        onChange={onChange}
                      />
                    )}
                  </View>
                )}
              />
            </View>
          </View>
        </View>

        {/* --- ACTION BUTTONS --- */}
        {isEditing ? (
          <View className="flex-row justify-between mt-8">
            <TouchableOpacity
              onPress={() => {
                setIsEditing(false);
                reset();
              }}
              disabled={isLoading}
              className="w-[48%] border border-white/10 py-4 rounded-2xl items-center"
            >
              <Typo className="text-white font-sans-bold text-base">
                Cancel
              </Typo>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit(onSave)}
              disabled={isLoading}
              className="w-[48%] bg-gold-500 py-4 rounded-2xl items-center shadow-xl shadow-gold-500/20"
            >
              {isLoading ? (
                <ActivityIndicator color={colors.brand[900]} />
              ) : (
                <Typo className="text-brand-900 font-sans-bold text-base">
                  Save
                </Typo>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            className="mt-8 bg-gold-500 py-4 rounded-2xl items-center shadow-xl shadow-gold-500/20"
          >
            <Typo className="text-brand-900 font-sans-bold text-base">
              Edit Profile
            </Typo>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ModalWrapper>
  );
};

export default PersonalDetails;
