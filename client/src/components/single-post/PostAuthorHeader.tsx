import { Link as RouterLink } from "react-router-dom";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { getInitials } from "../../utils/stringUtils";
import { formatRelative } from "../../utils/dateUtils";

interface PostAuthorHeaderProps {
  authorId: number;
  authorName: string;
  createdAt: string;
  /** משבית את הקישור לפרופיל המחבר ב-preview mode. */
  preview?: boolean;
}

export const PostAuthorHeader = ({
  authorId,
  authorName,
  createdAt,
  preview = false,
}: PostAuthorHeaderProps) => (
  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
    <Avatar sx={{ bgcolor: "primary.main", color: "background.default", width: 40, height: 40, fontWeight: 700 }}>
      {getInitials(authorName)}
    </Avatar>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        component={preview ? "span" : RouterLink}
        to={preview ? undefined : `/user-posts/${authorId}`}
        sx={{
          fontWeight: 600,
          color: "primary.main",
          textDecoration: "none",
          "&:hover": preview ? {} : { textDecoration: "underline" },
          fontSize: "0.95rem",
        }}
      >
        {authorName}
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
        {formatRelative(createdAt)}
      </Typography>
    </Box>
  </Stack>
);
