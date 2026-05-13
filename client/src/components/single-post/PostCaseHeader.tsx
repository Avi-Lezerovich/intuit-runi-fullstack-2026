import { Box, Typography } from "@mui/material";
import { DOC_FONT } from "../../theme";

interface PostCaseHeaderProps {
  postId: number;
  createdAt: string;
}

const formatCaseNumber = (postId: number, createdAt: string): string => {
  const year = new Date(createdAt).getFullYear() || new Date().getFullYear();
  const padded = String(postId).padStart(4, "0");
  return `ת.פ. ${padded}/${year}`;
};

/**
 * Thin docket-style header rendered at the top of each post card.
 * Mimics the case-number + court-name strip of an Israeli legal filing.
 *   ת.פ. 0123/2026                       בית המשפט של LolSuit
 *   ───────────────────────────────────────────────────────────
 */
export const PostCaseHeader = ({ postId, createdAt }: PostCaseHeaderProps) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: 1,
      pb: 0.75,
      mb: 1.5,
      borderBottom: "1px solid",
      borderColor: "divider",
      fontFamily: DOC_FONT,
      fontSize: "0.78rem",
      color: "text.secondary",
      letterSpacing: "0.02em",
    }}
  >
    <Typography component="span" sx={{ fontFamily: "inherit", fontSize: "inherit", fontWeight: 600 }}>
      {formatCaseNumber(postId, createdAt)}
    </Typography>
    <Typography component="span" sx={{ fontFamily: "inherit", fontSize: "inherit" }}>
      בית המשפט של LolSuit
    </Typography>
  </Box>
);
