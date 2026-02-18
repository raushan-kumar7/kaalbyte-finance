import { auth } from "@/src/config/firebase";

/**
 * Get the current authenticated user's ID
 * @throws Error if user is not authenticated
 * @returns The user's UID
 */
export const getCurrentUserId = (): string => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  return user.uid;
};

/**
 * Get the current authenticated user's ID or null
 * @returns The user's UID or null if not authenticated
 */
export const getCurrentUserIdOrNull = (): string | null => {
  const user = auth.currentUser;
  return user?.uid ?? null;
};

/**
 * Check if user is currently authenticated
 * @returns boolean
 */
export const isUserAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};

/**
 * Get current user's email
 * @returns User's email or null
 */
export const getCurrentUserEmail = (): string | null => {
  return auth.currentUser?.email ?? null;
};

/**
 * Get current user object
 * @returns Firebase User object or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
