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
 * Centered docket-style header at the top of each post card. Mimics how an
 * Israeli court filing opens: court name on top, case number underneath, a
 * double-rule divider below the block.
 *
 *                  בית המשפט של LolSuit
 *                     ת.פ. 0010/2026
 *      ═══════════════════════════════════════════
 */
export const PostCaseHeader = ({ postId, createdAt }: PostCaseHeaderProps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      mb: 1.75,
      pb: 0.75,
      // Double-rule divider: two stacked 1px lines, 2px apart.
      borderBottom: "1px solid",
      borderColor: "divider",
      position: "relative",
      "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -3,
        borderBottom: "1px solid",
        borderColor: "divider",
      },
    }}
  >
    <Typography
      component="span"
      sx={{
        fontFamily: DOC_FONT,
        fontWeight: 700,
        fontSize: "0.82rem",
        letterSpacing: "0.18em",
        color: "text.secondary",
        textAlign: "center",
        lineHeight: 1.3,
      }}
    >
      בית המשפט של LolSuit
    </Typography>
    <Typography
      component="span"
      sx={{
        fontFamily: DOC_FONT,
        fontWeight: 500,
        fontSize: "0.72rem",
        letterSpacing: "0.04em",
        color: "text.secondary",
        textAlign: "center",
        mt: 0.25,
      }}
    >
      {formatCaseNumber(postId, createdAt)}
    </Typography>
  </Box>
);
