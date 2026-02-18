import { useCallback } from "react";
import { useAuthStore } from "../stores";
import { AuthService } from "../services";
import { IChangePassword, ISignin, ISignup } from "../validations/auth";
import { showToast } from "@/src/utils/toast";
import * as Device from "expo-device";

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
    setHasSeenLanding, // ✅ Added
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
          setHasSeenLanding(true); // ✅ Mark landing as seen on signup
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
          setHasSeenLanding(true); // ✅ Mark landing as seen on signin
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
  const signout = useCallback(async () => {
    setLoading(true);
    try {
      await AuthService.signout();
      clearSession();
      showToast.success("Signed out safely");
    } catch {
      showToast.error("Error signing out");
    } finally {
      setLoading(false);
    }
  }, [clearSession, setLoading]);

  const changePassword = useCallback(
  async (data: IChangePassword) => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.changePassword(data.currentPassword, data.newPassword);
      const profile = await AuthService.getCurrentUserProfile();
      if (profile) {
        setSession({ ...profile, passwordLastChangedAt: new Date() });
      }
      showToast.success("Password changed successfully");
    } catch (e: any) {
      const msg = e.message || "Failed to update password";
      showToast.error(msg);
      setError(msg);
      throw e;
    } finally {
      setLoading(false); // No setTimeout needed anymore
    }
  },
  [setSession, setLoading, setError],
);

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
        return true; // Explicitly return true for success
      } catch (e: any) {
        const msg = e.message || "Failed to send reset email";
        showToast.error(msg);
        setError(msg);
        return false; // Explicitly return false for failure
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError],
  );

  // --- Session Management ---
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
    fetchSessions,
    terminateSession,
    terminateOtherSessions,
    subscribeSessions,
    toggleBiometric,
  };
};
