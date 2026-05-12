import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import { Link as RouterLink } from "react-router-dom";

import type { User } from "../../types";
import { getInitials } from "../../utils/stringUtils";
import { formatHebrewDate } from "../../utils/dateUtils";

/**
 * Top section of a user profile card: avatar (initials), name, email, joined-on date,
 * and a "submit new lawsuit" CTA shown only to the profile owner.
 * Used inside <UserProfileCard /> on the ProfilePage route.
 */

interface ProfileHeaderProps {
  user: User;
  /** Logged-in user's id (or null/undefined when anonymous). Controls the owner-only CTA. */
  currentUserId?: number | null;
}

export const ProfileHeader = ({ user, currentUserId }: ProfileHeaderProps) => {
  const isOwner = currentUserId === user.id;

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
      <Avatar
        sx={{
          bgcolor: "primary.main",
          color: "background.default",
          width: 80,
          height: 80,
          fontSize: "1.75rem",
          fontWeight: 700,
          border: "3px solid",
          borderColor: "secondary.main",
        }}
      >
        {getInitials(user.name)}
      </Avatar>
      <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "right" } }}>
        <Typography
          variant="h4"
          sx={{ fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 700, color: "primary.dark" }}
        >
          {user.name}
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>{user.email}</Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5 }}>
          חבר/ה במערכת מאז {formatHebrewDate(user.created_at)}
        </Typography>
        {isOwner && (
          <Button
            component={RouterLink}
            to="/new-post"
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<GavelIcon />}
            sx={{ mt: 1.5 }}
          >
            הגש תביעה חדשה
          </Button>
        )}
      </Box>
    </Stack>
  );
};
