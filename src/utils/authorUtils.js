/**
 * Extracts author information, preferring organization over user.
 * @param {object} user - The user object from API
 * @param {object} organization - The organization object from API
 * @returns {object} { displayName, avatarImage, avatarLetter }
 */
export const getAuthorInfo = (user, organization) => {
  // Prefer organization name/avatar when available; otherwise fall back to user
  const displayName = organization?.name || user?.name || "";
  const avatarImage = organization?.profile_image_90 || user?.profile_image_90 || "";
  const avatarLetter = displayName?.charAt(0).toUpperCase();

  return { displayName, avatarImage, avatarLetter };
};
