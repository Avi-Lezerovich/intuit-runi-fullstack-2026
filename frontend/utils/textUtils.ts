interface TruncateResult {
  truncated: string;
  isLong: boolean;
}

/**
 * Truncates text to a maximum length, breaking at word boundaries.
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns { truncated: string, isLong: boolean }
 */
export const truncateText = (text: string | undefined, maxLength: number): TruncateResult => {
  if (!text) {
    return { truncated: "", isLong: false };
  }

  if (text.length <= maxLength) {
    return { truncated: text, isLong: false };
  }

  // Find the last space within the max length to break at word boundary
  const cutIndex = text.lastIndexOf(" ", maxLength);
  const truncated = text.slice(0, cutIndex).trimEnd();

  return { truncated, isLong: true };
};
