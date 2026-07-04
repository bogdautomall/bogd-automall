import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes intelligently, resolving conflicts.
 * Used throughout the UI component library.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
