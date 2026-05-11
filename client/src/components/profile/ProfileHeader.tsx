import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import { Link as RouterLink } from "react-router-dom";

import type { User } from "../../types";

interface ProfileHeaderProps {
  user: User;
  currentUserId?: number | null;
}

const initials = (name: string): string => {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
};

const HEBREW_DATE = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const ProfileHeader = ({ user, currentUserId }: ProfileHeaderProps) => {
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
        {initials(user.name)}
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
          חבר/ה במערכת מאז {HEBREW_DATE.format(new Date(user.created_at))}
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

export default ProfileHeader;