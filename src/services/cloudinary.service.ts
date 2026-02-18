import CryptoJS from "crypto-js";
import { APP_CONFIG } from "../config/app_cfg";

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

class CloudinaryService {
  private static CLOUD_NAME = APP_CONFIG.clodinary.cloud_name;
  private static UPLOAD_PRESET = APP_CONFIG.clodinary.upload_preset;
  private static API_KEY = APP_CONFIG.clodinary.api_key;
  private static API_SECRET = APP_CONFIG.clodinary.api_secret;

  /**
   * 1. Helper: Extract public_id from a Cloudinary URL
   */
  private static extractPublicId(url: string): string | null {
    try {
      // Regex matches the string between /upload/ (with optional version v123/) and the file extension
      const parts = url.split("/");
      const uploadIndex = parts.indexOf("upload");
      if (uploadIndex === -1) return null;

      // Skip "upload" and optional "v12345678" versioning
      const resultPart = parts[uploadIndex + 1].startsWith("v")
        ? parts.slice(uploadIndex + 2).join("/")
        : parts.slice(uploadIndex + 1).join("/");

      return resultPart.split(".")[0];
    } catch {
      return null;
    }
  }

  /**
   * 2. Main: Upload image using Unsigned Preset
   */
  static async uploadImage(
    imageUri: string,
    folder: string = "user-avatars",
  ): Promise<CloudinaryUploadResponse> {
    const formData = new FormData();

    // React Native specific File formatting
    const filename = imageUri.split("/").pop() || "upload.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append("file", {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    formData.append("upload_preset", this.UPLOAD_PRESET!);
    formData.append("folder", folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Upload failed");

    return {
      secure_url: data.secure_url,
      public_id: data.public_id,
    };
  }

  /**
   * 3. Main: Delete image using Signed Request
   * Requires: npm install crypto-js
   */
  static async deleteImageByUrl(url: string): Promise<boolean> {
    const publicId = this.extractPublicId(url);
    if (!publicId) return false;

    const timestamp = Math.round(new Date().getTime() / 1000);
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${this.API_SECRET}`;
    const signature = CryptoJS.SHA1(stringToSign).toString();

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("signature", signature);
    formData.append("api_key", this.API_KEY!);
    formData.append("timestamp", timestamp.toString());

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/destroy`,
      { method: "POST", body: formData },
    );

    const data = await response.json();
    return data.result === "ok";
  }

  /**
   * 4. Helper: Replace old image with new one
   */
  static async replaceImage(
    newUri: string,
    oldUrl?: string,
  ): Promise<{ url: string }> {
    // Always upload first to ensure we don't delete the old one if the new upload fails
    const uploadResult = await this.uploadImage(newUri);

    if (oldUrl) {
      // Attempt to delete old image, but don't crash if it fails (background cleanup)
      this.deleteImageByUrl(oldUrl).catch((err) =>
        console.warn("Old image cleanup failed", err),
      );
    }

    return { url: uploadResult.secure_url };
  }
}

export { CloudinaryService };
