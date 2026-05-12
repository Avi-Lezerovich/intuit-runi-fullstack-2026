import { Box, LinearProgress, Typography } from "@mui/material";

interface PasswordStrengthBarProps {
  score: number;
  label: string;
  color: "error" | "warning" | "success";
}

export const PasswordStrengthBar = ({ score, label, color }: PasswordStrengthBarProps) => (
  <Box sx={{ mt: 0.5, px: 0.5 }}>
    <LinearProgress
      variant="determinate"
      value={score}
      color={color}
      sx={{ height: 6, borderRadius: 3 }}
    />
    <Typography
      variant="caption"
      sx={{ color: `${color}.main`, fontWeight: 600, mt: 0.25, display: "block" }}
    >
      {label}
    </Typography>
  </Box>
);