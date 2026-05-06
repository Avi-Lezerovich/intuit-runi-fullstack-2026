import { Box, Typography } from "@mui/material";
import ProfilePicture from "../../components/ui/ProfilePicture";
import UserSocialLinks from "../../components/ui/UserSocialLinks";
import type { UserProfile } from "../../types";

interface UserProfileHeaderProps {
  author: UserProfile | null;
  totalEstimated: number | null;
  postsLength: number;
}

const UserProfileHeader = ({ author, totalEstimated, postsLength }: UserProfileHeaderProps) => {
  if (!author) {
    return null;
  }

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        p: { xs: 2, md: 4 },
        mb: 4,
        display: "flex",
        gap: 3,
        alignItems: "center",
      }}
    >
      <ProfilePicture
        src={author.profile_image_90}
        alt={author.name}
        sx={{ width: 96, height: 96, borderWidth: 4 }}
      />

      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {author.name}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          @{author.username}
        </Typography>

        <UserSocialLinks profile={author} />

        <Box
          sx={{
            display: "inline-flex",
            bgcolor: "primary.light",
            color: "primary.main",
            px: 2,
            py: 0.75,
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          {totalEstimated !== null ? `${totalEstimated} Articles Published` : `${postsLength}+ Articles`}
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfileHeader;