import { IconButton, Stack } from "@mui/material";
import WebIcon from "@mui/icons-material/Web";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import GitHubIcon from "@mui/icons-material/GitHub";
import type { UserProfile } from "../../types";

interface UserSocialLinksProps {
  profile: Pick<
    UserProfile,
    "github_username" | "twitter_username" | "linkedin_username" | "website_url"
  >;
  spacing?: number;
  mb?: number;
}

const UserSocialLinks = ({ profile, spacing = 1, mb = 2 }: UserSocialLinksProps) => {
  const hasLinks =
    !!profile.github_username ||
    !!profile.twitter_username ||
    !!profile.linkedin_username ||
    !!profile.website_url;

  if (!hasLinks) {
    return null;
  }

  return (
    <Stack direction="row" spacing={spacing} sx={{ mb }}>
      {profile.github_username && (
        <IconButton
          component="a"
          href={`https://github.com/${profile.github_username}`}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
        >
          <GitHubIcon fontSize="small" />
        </IconButton>
      )}
      {profile.twitter_username && (
        <IconButton
          component="a"
          href={`https://x.com/${profile.twitter_username}`}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
        >
          <XIcon fontSize="small" />
        </IconButton>
      )}
      {profile.linkedin_username && (
        <IconButton
          component="a"
          href={`https://linkedin.com/in/${profile.linkedin_username}`}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
        >
          <LinkedInIcon fontSize="small" />
        </IconButton>
      )}
      {profile.website_url && (
        <IconButton
          component="a"
          href={profile.website_url}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
        >
          <WebIcon fontSize="small" />
        </IconButton>
      )}
    </Stack>
  );
};

export default UserSocialLinks;