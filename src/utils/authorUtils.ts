interface AuthorSource {
  name?: string;
  profile_image_90?: string;
}

interface AuthorInfo {
  displayName: string;
  avatarImage: string;
  avatarLetter: string;
}

/**
 * Extracts author information, preferring organization over user.
 * @param user - The user object from API
 * @param organization - The organization object from API
 * @returns { displayName, avatarImage, avatarLetter }
 */
export const getAuthorInfo = (
  user: AuthorSource | undefined,
  organization: AuthorSource | undefined
): AuthorInfo => {
  // Prefer organization name/avatar when available; otherwise fall back to user
  const displayName = organization?.name || user?.name || "";
  const avatarImage = organization?.profile_image_90 || user?.profile_image_90 || "";
  const avatarLetter = displayName?.charAt(0).toUpperCase();

  return { displayName, avatarImage, avatarLetter };
};
