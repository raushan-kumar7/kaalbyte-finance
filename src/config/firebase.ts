import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_CONFIG } from "./app_cfg";

// Initialize Firebase
const app = initializeApp(APP_CONFIG.firebase);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firebaseDB = getFirestore(app);