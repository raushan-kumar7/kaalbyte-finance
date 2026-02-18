import { UserService } from "../services";
import { showToast } from "../utils/toast";
import { useAuthStore } from "../stores";
import { useImageUpload } from "../utils/useImagePicker";
import { useState } from "react";

export const useUser = () => {
  const { user, setSession } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const { pickImage } = useImageUpload();

  const handleUpdateAvatar = async () => {
    if (!user) return;

    try {
      const uri = await pickImage();
      if (!uri) return;

      setIsLoading(true);

      const newAvatarUrl = await UserService.uploadAvatar(
        user.id,
        uri,
        user.avatar,
      );

      // Update the session with new avatar
      setSession({ ...user, avatar: newAvatarUrl });

      showToast.success("Profile picture updated!");
    } catch (error: any) {
      showToast.error("Upload Error", error.message || "Failed to upload");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (updates: any) => {
    if (!user) return;

    try {
      setIsLoading(true);

      await UserService.updateProfile(user.id, updates);

      // Update the session with new data
      setSession({ ...user, ...updates });

      showToast.success("Profile updated!");
    } catch (error: any) {
      showToast.error("Update Error", error.message || "Failed to update");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    updateAvatar: handleUpdateAvatar,
    updateProfile: handleUpdateProfile,
  };
};
