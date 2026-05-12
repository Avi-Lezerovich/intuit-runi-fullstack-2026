/**
 * String-shaping helpers used across the UI.
 * Pure functions, no React dependencies — safe to call anywhere.
 */

/**
 * Builds an avatar initial-string from a display name.
 * Splits on whitespace, takes the first letter of each part, caps at 2 chars.
 * Returns "" for empty input so callers can render an empty Avatar safely.
 * Examples: "John Doe" → "JD", "אבי לזרוביץ" → "אל", "" → "".
 */
export const getInitials = (name: string): string => {
  if (!name) return "";
  return name.split(/\s+/).map((p) => p[0]).filter(Boolean).slice(0, 2).join("");
};
