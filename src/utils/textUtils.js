/**
 * Truncates text to a maximum length, breaking at word boundaries.
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {object} { truncated: string, isLong: boolean }
 */
export const truncateText = (text, maxLength) => {
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
