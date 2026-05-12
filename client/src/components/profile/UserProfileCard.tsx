import { Divider, Paper, Stack } from "@mui/material";

import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";

import type { User, UserStats } from "../../types";

/**
 * Paper container that combines the header (avatar + name + joined date)
 * with the three-up stats row underneath. Rendered at the top of the ProfilePage route.
 */

interface UserProfileCardProps {
  user: User;
  stats: UserStats;
  currentUserId?: number | null;
}

export const UserProfileCard = ({ user, stats, currentUserId }: UserProfileCardProps) => {
  return (
    <Paper sx={{ p: { xs: 2, sm: 4 }, mb: 3 }}>
      <Stack spacing={0}>
        <ProfileHeader user={user} currentUserId={currentUserId} />
        <Divider sx={{ my: 3 }} />
        <ProfileStats stats={stats} />
      </Stack>
    </Paper>
  );
};
