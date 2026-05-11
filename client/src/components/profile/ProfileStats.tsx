import { Box, Divider, Stack, Typography } from "@mui/material";

import type { UserStats } from "../../types";

interface ProfileStatsProps {
  stats: UserStats;
}

const ProfileStats = ({ stats }: ProfileStatsProps) => {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-around">
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontFamily: '"Frank Ruhl Libre", serif', color: "primary.main", fontWeight: 700 }}>
          {stats.total}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: 1 }}>
          סה״כ תביעות
        </Typography>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontFamily: '"Frank Ruhl Libre", serif', color: "error.main", fontWeight: 700 }}>
          {stats.guilty}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: 1 }}>
          הרשעות
        </Typography>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontFamily: '"Frank Ruhl Libre", serif', color: "secondary.dark", fontWeight: 700 }}>
          {stats.success_percent}%
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: 1 }}>
          שיעור הצלחה
        </Typography>
      </Box>
    </Stack>
  );
};

export default ProfileStats;