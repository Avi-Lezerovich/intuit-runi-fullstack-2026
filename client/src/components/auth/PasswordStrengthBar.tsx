import { Box, LinearProgress, Typography } from "@mui/material";

/**
 * Visual strength meter for the Signup password field.
 * Pure presentational — the score/label/color come from `scorePassword` in validationUtils.
 */

interface PasswordStrengthBarProps {
  /** 0–100, drives the LinearProgress fill width. */
  score: number;
  /** Localized label shown under the bar (e.g. "סיסמה חזקה"). */
  label: string;
  /** MUI palette key — picks the bar color. */
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
