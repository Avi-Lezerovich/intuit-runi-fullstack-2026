import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import UserProfileAvatar from "../../components/ui/UserProfileAvatar";

import type { User } from "../../types";

interface UserCardProps {
  user: User;
  onSeePostsClick: (user: User) => void;
}

const UserCard = ({ user, onSeePostsClick }: UserCardProps) => {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
        border: "1px solid",
        borderColor: "divider",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        minWidth: 180,
      }}
    >
      <UserProfileAvatar src={user.profile_image_90} alt={user.name} sx={{ width: 72, height: 72, mb: 1.5 }} />
      <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{user.name}</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
        @{user.username}
      </Typography>

      <Chip
        label={`${user.post_count.toLocaleString()} posts`}
        size="small"
        sx={{ mb: 1, bgcolor: "action.hover", fontWeight: 600 }}
      />

      <Button
        variant="outlined"
        size="small"
        fullWidth
        onClick={() => onSeePostsClick(user)}
        sx={{ mt: 1 }}
      >
        View Profile
      </Button>
    </Box>
  );
};

export default React.memo(UserCard);
