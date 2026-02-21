import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { auth, firebaseDB } from "../config/firebase";
import { User } from "../types/user";
import { CloudinaryService } from "./cloudinary.service";

export class UserService {
  /**
   * Updates user profile data in Firestore
   */
  static async updateProfile(
    uid: string,
    updates: Partial<User>,
  ): Promise<void> {
    const userRef = doc(firebaseDB, "users", uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  /**
   * Uploads image to Cloudinary and updates the user's avatar URL in Firestore
   */
  static async uploadAvatar(
    uid: string,
    imageUri: string,
    oldImageUrl?: string,
  ): Promise<string> {
    // replaceImage handles both upload and old image cleanup
    const { url } = await CloudinaryService.replaceImage(imageUri, oldImageUrl);

    // Update Firestore with new avatar URL
    await this.updateProfile(uid, { avatar: url });

    return url;
  }

  /**
   * Full cleanup: Deletes Firestore data, Cloudinary image, and Auth account
   */
  static async deleteAccount(uid: string, avatarUrl?: string): Promise<void> {
    // 1. Delete Cloudinary Image
    if (avatarUrl) {
      await CloudinaryService.deleteImageByUrl(avatarUrl).catch(console.error);
    }

    // 2. Delete Firestore Document
    await deleteDoc(doc(firebaseDB, "users", uid));

    // 3. Delete Firebase Auth User
    const currentUser = auth.currentUser;
    if (currentUser) {
      await deleteUser(currentUser);
    }
  }
}
