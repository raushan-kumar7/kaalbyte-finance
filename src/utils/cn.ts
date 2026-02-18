import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes and handles conditional logic
 * Usage: cn('bg-blue-500', isPressed && 'bg-blue-700', className)
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
