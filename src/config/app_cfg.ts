export const APP_CONFIG = {
  firebase: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  },
  app: {
    name: "KaalByte Finance",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    db_name: process.env.EXPO_PUBLIC_DB_NAME,
  },
  clodinary: {
    cloud_name: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
    upload_preset: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    api_key: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET,
  },
  features: {
    biometricAuth: true,
    pushNotifications: true,
  },
} as const;
