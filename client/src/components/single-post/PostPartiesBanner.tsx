import { Box, Typography } from "@mui/material";

interface PostPartiesBannerProps {
  plaintiffName: string;
  defendantName: string;
  /** ב-preview mode מציג fallback "—" כשאין נתבע. */
  preview?: boolean;
}

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
    <Typography sx={{ color: "secondary.dark", fontStyle: "italic", fontWeight: 700, fontSize: "1.1rem" }}>
      נ׳
    </Typography>
    <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>נתבע:</Typography>
    <Typography sx={{ fontWeight: 700, color: "error.main" }}>
      {defendantName || (preview ? "—" : "")}
    </Typography>
  </Box>
);
