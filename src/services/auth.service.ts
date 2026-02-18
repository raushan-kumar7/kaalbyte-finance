import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  UserCredential,
} from "firebase/auth";
import { auth, firebaseDB } from "../config/firebase";
import { ISignin, ISignup } from "../validations/auth";
import { User } from "@/src/types/user";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  writeBatch,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import * as Device from "expo-device";
import * as Localization from "expo-localization";

class AuthService {
  /**
   * Checks if a username is already taken in Firestore
   */
  static async isUsernameTaken(username: string): Promise<boolean> {
    const usersRef = collection(firebaseDB, "users");
    const q = query(usersRef, where("username", "==", username.toLowerCase()));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  static async createSession(uid: string): Promise<void> {
    try {
      const sessionsRef = collection(firebaseDB, "sessions");

      // Generate a unique ID for this specific local session
      const sessionDocRef = doc(sessionsRef);

      const sessionData = {
        id: sessionDocRef.id,
        userId: uid,
        device: Device.modelName || "Unknown Device",
        os: `${Device.osName} ${Device.osVersion}`,
        location: Localization.getCalendars()[0].timeZone || "Unknown Location",
        lastActive: new Date().toISOString(),
        isCurrent: true, // This is relative to the device creating it
        type: Device.deviceType === 1 ? "mobile" : "desktop",
        createdAt: new Date(),
      };

      await setDoc(sessionDocRef, sessionData);
    } catch (error) {
      console.error("Failed to create session record:", error);
    }
  }

  /**
   * Complete Signup Flow:
   * 1. Check Username -> 2. Create Auth User -> 3. Create Firestore Profile
   */
  static async signup(data: ISignup): Promise<void> {
    // 1. Pre-validation: Check username uniqueness
    const taken = await this.isUsernameTaken(data.username);
    if (taken) {
      throw new Error("This username is already taken.");
    }

    // 2. Create the user in Firebase Auth
    // This will automatically throw an error if the email is already in use
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password,
    );

    const uid = userCredential.user.uid;

    // 3. Prepare the Profile (Mapping ISignup to User interface)
    const userProfile: User = {
      id: uid,
      userId: uid,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 4. Save to Firestore
    await setDoc(doc(firebaseDB, "users", uid), userProfile);

    // 5. Create Session Record
    await this.createSession(uid);
  }

  // static async signin({ userId, password }: ISignin): Promise<UserCredential> {
  //   // Note: If userId is meant to be a username, you'd first need to
  //   // query Firestore to find the email associated with that username.
  //   return await signInWithEmailAndPassword(auth, userId, password);
  // }

  static async signin({ userId, password }: ISignin): Promise<UserCredential> {
    let email = userId;

    // If the userId doesn't look like an email, treat it as a username
    if (!userId.includes("@")) {
      const usersRef = collection(firebaseDB, "users");
      const q = query(usersRef, where("username", "==", userId.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Username not found.");
      }
      email = querySnapshot.docs[0].data().email;
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await this.createSession(userCredential.user.uid);
    return userCredential;
  }

  static async signout(): Promise<void> {
    return await signOut(auth);
  }

  static async getCurrentUserProfile(): Promise<User | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    const docRef = doc(firebaseDB, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as User;
    }
    return null;
  }

  static async changePassword(
    currentPass: string,
    newPass: string,
  ): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("No user session found");

    // Firebase requires re-authentication before sensitive operations
    const credential = EmailAuthProvider.credential(user.email, currentPass);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPass);

    const userRef = doc(firebaseDB, "users", user.uid);
    await updateDoc(userRef, {
      passwordLastChangedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static async resetPassword(email: string): Promise<void> {
  try {
    // Firebase sends an email with a link to reset the password
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    // Map Firebase errors to user-friendly messages
    if (error.code === 'auth/user-not-found') {
      throw new Error("No user found with this email address.");
    }
    throw error;
  }
}

  static async getUserSessions(uid: string): Promise<any[]> {
    const sessionsRef = collection(firebaseDB, "sessions");
    const q = query(sessionsRef, where("userId", "==", uid));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  static async terminateSession(sessionId: string): Promise<void> {
    await deleteDoc(doc(firebaseDB, "sessions", sessionId));
  }

  static async terminateAllSessions(uid: string): Promise<void> {
    const sessionsRef = collection(firebaseDB, "sessions");
    const q = query(sessionsRef, where("userId", "==", uid));
    const querySnapshot = await getDocs(q);

    const batch = writeBatch(firebaseDB);

    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }

  /**
   * Listens to session changes in real-time
   * @param uid User ID
   * @param callback Function to handle the updated session list
   */
  static subscribeToSessions(uid: string, callback: (sessions: any[]) => void) {
    const sessionsRef = collection(firebaseDB, "sessions");
    const q = query(sessionsRef, where("userId", "==", uid));

    // onSnapshot returns an unsubscribe function
    return onSnapshot(q, (querySnapshot) => {
      const sessions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(sessions);
    });
  }
}

export { AuthService };
