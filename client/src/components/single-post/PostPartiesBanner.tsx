/**
 * "Plaintiff vs. Defendant" banner — the legal-themed framing strip on every Post card.
 * In preview mode, shows "—" when defendant is empty so the placeholder isn't blank.
 */
import { Box, Typography } from "@mui/material";

interface PostPartiesBannerProps {
  plaintiffName: string;
  defendantName: string;
  /** In preview mode, falls back to "—" when the defendant field is empty. */
  preview?: boolean;
}

/**
 * Renders the plaintiff-vs-defendant banner with legal-themed styling.
 * Falls back to "—" for the defendant field in preview mode when the user hasn't filled it in yet.
 * @param plaintiffName - The plaintiff name to display.
 * @param defendantName - The defendant name to display.
 * @param preview - If true, shows "—" when defendantName is empty (used by NewPost preview).
 */
export const PostPartiesBanner = ({
  plaintiffName,
  defendantName,
  preview = false,
}: PostPartiesBannerProps) => (
  <Box
    sx={{
      backgroundColor: "rgba(184, 134, 11, 0.08)",
      border: "1px solid rgba(184, 134, 11, 0.25)",
      borderRadius: 1,
      px: 2,
      py: 1.25,
      mb: 1.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: { xs: 1, sm: 2 },
      flexWrap: "wrap",
      fontFamily: '"Frank Ruhl Libre", serif',
    }}
  >
    <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>תובע:</Typography>
    <Typography sx={{ fontWeight: 700, color: "primary.main" }}>{plaintiffName}</Typography>
    <Typography sx={{ color: "primary.main", fontStyle: "italic", fontWeight: 700, fontSize: "1.1rem" }}>
      נ׳
    </Typography>
    <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>נתבע:</Typography>
    <Typography sx={{ fontWeight: 700, color: "error.main" }}>
      {defendantName || (preview ? "—" : "")}
    </Typography>
  </Box>
);
