// import { useCallback } from "react";
// import { useAuthStore } from "../stores";
// import { AuthService } from "../services";
// import { IChangePassword, ISignin, ISignup } from "../validations/auth";
// import { showToast } from "@/src/utils/toast";
// import * as Device from "expo-device";

// export const useAuth = () => {
//   const {
//     user,
//     isAuthenticated,
//     sessions,
//     isLoading,
//     error,
//     isBiometricEnabled,
//     setLoading,
//     setError,
//     setSession,
//     clearSession,
//     toggleBiometric,
//     setSessions,
//     removeSession,
//     removeAllOtherSessions,
//     setHasSeenLanding,
//   } = useAuthStore();

//   // --- Registration ---
//   const signup = useCallback(
//     async (data: ISignup) => {
//       setLoading(true);
//       setError(null);
//       try {
//         await AuthService.signup(data);
//         const profile = await AuthService.getCurrentUserProfile();
//         showToast.success("Account created successfully");
//         if (profile) {
//           setSession(profile);
//           setHasSeenLanding(true);
//         }
//       } catch (e: any) {
//         const msg = e.message || "An error occurred during signup";
//         showToast.error(msg);
//         setError(msg);
//         throw e;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [setSession, setLoading, setError, setHasSeenLanding],
//   );

//   // --- Login ---
//   const signin = useCallback(
//     async (data: ISignin) => {
//       setLoading(true);
//       setError(null);
//       try {
//         await AuthService.signin(data);
//         const profile = await AuthService.getCurrentUserProfile();
//         if (profile) {
//           setSession(profile);
//           setHasSeenLanding(true);
//           showToast.success("Welcome back!");
//         } else {
//           throw new Error("Profile not found");
//         }
//       } catch (e: any) {
//         const msg = e.message || "Invalid credentials";
//         showToast.error(msg);
//         setError(msg);
//         throw e;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [setSession, setLoading, setError, setHasSeenLanding],
//   );

//   // --- Logout ---
//   const signout = useCallback(async () => {
//     setLoading(true);
//     try {
//       await AuthService.signout();
//       clearSession();
//       showToast.success("Signed out safely");
//     } catch {
//       showToast.error("Error signing out");
//     } finally {
//       setLoading(false);
//     }
//   }, [clearSession, setLoading]);

//   const changePassword = useCallback(
//   async (data: IChangePassword) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await AuthService.changePassword(data.currentPassword, data.newPassword);
//       const profile = await AuthService.getCurrentUserProfile();
//       if (profile) {
//         setSession({ ...profile, passwordLastChangedAt: new Date() });
//       }
//       showToast.success("Password changed successfully");
//     } catch (e: any) {
//       const msg = e.message || "Failed to update password";
//       showToast.error(msg);
//       setError(msg);
//       throw e;
//     } finally {
//       setLoading(false); // No setTimeout needed anymore
//     }
//   },
//   [setSession, setLoading, setError],
// );

//   const forgotPassword = useCallback(
//     async (email: string): Promise<boolean> => {
//       if (!email) {
//         showToast.error("Please enter your email address");
//         return false;
//       }
//       setLoading(true);
//       setError(null);
//       try {
//         await AuthService.resetPassword(email);
//         showToast.success("Reset link sent to your email!");
//         return true; // Explicitly return true for success
//       } catch (e: any) {
//         const msg = e.message || "Failed to send reset email";
//         showToast.error(msg);
//         setError(msg);
//         return false; // Explicitly return false for failure
//       } finally {
//         setLoading(false);
//       }
//     },
//     [setLoading, setError],
//   );

//   // --- Session Management ---
//   const fetchSessions = useCallback(async () => {
//     if (!user?.id) return;
//     setLoading(true);
//     try {
//       const data = await AuthService.getUserSessions(user.id);
//       const mappedSessions = data.map((s: any) => ({
//         ...s,
//         isCurrent:
//           s.device === Device.modelName &&
//           s.os.includes(Device.osVersion || ""),
//       }));
//       setSessions(mappedSessions);
//     } catch (e: any) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   }, [user?.id, setSessions, setLoading]);

//   const terminateSession = useCallback(
//     async (sessionId: string) => {
//       try {
//         await AuthService.terminateSession(sessionId);
//         removeSession(sessionId);
//         showToast.success("Session terminated");
//       } catch {
//         showToast.error("Could not terminate session");
//       }
//     },
//     [removeSession],
//   );

//   const terminateOtherSessions = useCallback(async () => {
//     if (!user?.id) return;
//     setLoading(true);
//     try {
//       await AuthService.terminateAllSessions(user.id);
//       removeAllOtherSessions();
//       showToast.success("All other sessions cleared");
//     } catch {
//       showToast.error("Action failed");
//     } finally {
//       setLoading(false);
//     }
//   }, [user?.id, removeAllOtherSessions, setLoading]);

//   const subscribeSessions = useCallback(() => {
//     if (!user?.id) return;
//     setLoading(true);
//     const unsubscribe = AuthService.subscribeToSessions(user.id, (data) => {
//       const mappedSessions = data.map((s) => ({
//         ...s,
//         isCurrent:
//           s.device === Device.modelName &&
//           s.os.includes(Device.osVersion || ""),
//       }));
//       setSessions(mappedSessions);
//       setLoading(false);
//     });
//     return unsubscribe;
//   }, [user?.id, setSessions, setLoading]);

//   return {
//     user,
//     isAuthenticated,
//     isLoading,
//     error,
//     sessions,
//     isBiometricEnabled,
//     signup,
//     signin,
//     signout,
//     changePassword,
//     forgotPassword,
//     fetchSessions,
//     terminateSession,
//     terminateOtherSessions,
//     subscribeSessions,
//     toggleBiometric,
//   };
// };

import { useCallback } from "react";
import { useAuthStore } from "../stores";
import { AuthService } from "../services";
import { IChangePassword, ISignin, ISignup } from "../validations/auth";
import { showToast } from "@/src/utils/toast";
import * as Device from "expo-device";
import * as LocalAuthentication from "expo-local-authentication";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    sessions,
    isLoading,
    error,
    isBiometricEnabled,
    setLoading,
    setError,
    setSession,
    clearSession,
    toggleBiometric,
    setSessions,
    removeSession,
    removeAllOtherSessions,
    setHasSeenLanding,
  } = useAuthStore();

  // --- Registration ---
  const signup = useCallback(
    async (data: ISignup) => {
      setLoading(true);
      setError(null);
      try {
        await AuthService.signup(data);
        const profile = await AuthService.getCurrentUserProfile();
        showToast.success("Account created successfully");
        if (profile) {
          setSession(profile);
          setHasSeenLanding(true);
        }
      } catch (e: any) {
        const msg = e.message || "An error occurred during signup";
        showToast.error(msg);
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setSession, setLoading, setError, setHasSeenLanding],
  );

  // --- Login ---
  const signin = useCallback(
    async (data: ISignin) => {
      setLoading(true);
      setError(null);
      try {
        await AuthService.signin(data);
        const profile = await AuthService.getCurrentUserProfile();
        if (profile) {
          setSession(profile);
          setHasSeenLanding(true);
          showToast.success("Welcome back!");
        } else {
          throw new Error("Profile not found");
        }
      } catch (e: any) {
        const msg = e.message || "Invalid credentials";
        showToast.error(msg);
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setSession, setLoading, setError, setHasSeenLanding],
  );

  // --- Logout ---
  // const signout = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     await AuthService.signout();
  //     clearSession();
  //     showToast.success("Signed out safely");
  //   } catch {
  //     showToast.error("Error signing out");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [clearSession, setLoading]);

  const signout = useCallback(async () => {
    setLoading(true);
    try {
      await AuthService.signout();
      clearSession();
      showToast.success("Signed out safely");
    } catch (e: any) {
      clearSession();
      showToast.error("Signed out locally, but remote session may persist.");
      console.error("Signout error:", e);
    } finally {
      setLoading(false);
    }
  }, [clearSession, setLoading]);

  // --- Change Password ---
  const changePassword = useCallback(
    async (data: IChangePassword) => {
      setLoading(true);
      setError(null);
      try {
        await AuthService.changePassword(
          data.currentPassword,
          data.newPassword,
        );
        const profile = await AuthService.getCurrentUserProfile();
        if (profile) {
          setSession({ ...profile, passwordLastChangedAt: new Date() });
        }

        // ✅ If biometrics enabled, update stored credentials with new password
        if (isBiometricEnabled && user?.username) {
          await AuthService.saveBiometricCredentials(
            user.username,
            data.newPassword,
          );
        }

        showToast.success("Password changed successfully");
      } catch (e: any) {
        const msg = e.message || "Failed to update password";
        showToast.error(msg);
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setSession, setLoading, setError, isBiometricEnabled, user?.username],
  );

  // --- Forgot Password ---
  const forgotPassword = useCallback(
    async (email: string): Promise<boolean> => {
      if (!email) {
        showToast.error("Please enter your email address");
        return false;
      }
      setLoading(true);
      setError(null);
      try {
        await AuthService.resetPassword(email);
        showToast.success("Reset link sent to your email!");
        return true;
      } catch (e: any) {
        const msg = e.message || "Failed to send reset email";
        showToast.error(msg);
        setError(msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError],
  );

  // ─────────────────────────────────────────
  // --- Biometric Methods ---
  // ─────────────────────────────────────────

  /**
   * Called from Security screen toggle ON.
   * Verifies biometrics then stores credentials securely.
   */
  const enableBiometrics = useCallback(
    async (password: string): Promise<void> => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!compatible || !enrolled) {
        throw new Error(
          "Biometrics not set up on this device. Please configure FaceID or Fingerprint in your phone settings.",
        );
      }

      // Confirm identity before saving
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirm your identity to enable biometric login",
        fallbackLabel: "Use Passcode",
        disableDeviceFallback: false,
      });

      if (!result.success) {
        throw new Error("Could not verify your identity.");
      }

      if (!user?.username) throw new Error("No active user session.");

      await AuthService.saveBiometricCredentials(user.username, password);
      toggleBiometric(true);
      showToast.success("Biometric login enabled!");
    },
    [user?.username, toggleBiometric],
  );

  /**
   * Called from Security screen toggle OFF.
   * Clears stored credentials and disables the flag.
   */
  const disableBiometrics = useCallback(async (): Promise<void> => {
    await AuthService.clearBiometricCredentials();
    toggleBiometric(false);
    showToast.success("Biometric login disabled.");
  }, [toggleBiometric]);

  /**
   * Called from the Login screen biometric button.
   * Triggers OS prompt then signs in with stored credentials.
   */
  const signinWithBiometrics = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.signinWithBiometrics();
      const profile = await AuthService.getCurrentUserProfile();
      if (profile) {
        setSession(profile);
        setHasSeenLanding(true);
        showToast.success("Welcome back!");
      } else {
        throw new Error("Profile not found after biometric sign-in.");
      }
    } catch (e: any) {
      const msg = e.message || "Biometric sign-in failed";
      showToast.error(msg);
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [setSession, setLoading, setError, setHasSeenLanding]);

  // ─────────────────────────────────────────
  // --- Session Management ---
  // ─────────────────────────────────────────

  const fetchSessions = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await AuthService.getUserSessions(user.id);
      const mappedSessions = data.map((s: any) => ({
        ...s,
        isCurrent:
          s.device === Device.modelName &&
          s.os.includes(Device.osVersion || ""),
      }));
      setSessions(mappedSessions);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user?.id, setSessions, setLoading]);

  const terminateSession = useCallback(
    async (sessionId: string) => {
      try {
        await AuthService.terminateSession(sessionId);
        removeSession(sessionId);
        showToast.success("Session terminated");
      } catch {
        showToast.error("Could not terminate session");
      }
    },
    [removeSession],
  );

  const terminateOtherSessions = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await AuthService.terminateAllSessions(user.id);
      removeAllOtherSessions();
      showToast.success("All other sessions cleared");
    } catch {
      showToast.error("Action failed");
    } finally {
      setLoading(false);
    }
  }, [user?.id, removeAllOtherSessions, setLoading]);

  const subscribeSessions = useCallback(() => {
    if (!user?.id) return;
    setLoading(true);
    const unsubscribe = AuthService.subscribeToSessions(user.id, (data) => {
      const mappedSessions = data.map((s) => ({
        ...s,
        isCurrent:
          s.device === Device.modelName &&
          s.os.includes(Device.osVersion || ""),
      }));
      setSessions(mappedSessions);
      setLoading(false);
    });
    return unsubscribe;
  }, [user?.id, setSessions, setLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    sessions,
    isBiometricEnabled,
    signup,
    signin,
    signout,
    changePassword,
    forgotPassword,
    // Biometrics
    enableBiometrics,
    disableBiometrics,
    signinWithBiometrics,
    // Sessions
    fetchSessions,
    terminateSession,
    terminateOtherSessions,
    subscribeSessions,
    toggleBiometric,
  };
};
