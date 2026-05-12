/**
 * Lawsuit title — serif H3 with brand styling.
 * In preview mode shows a "כותרת התביעה תופיע כאן" placeholder so the empty form looks alive.
 */
import { Typography } from "@mui/material";

interface PostTitleProps {
  title: string;
  /** In preview mode, shows a "כותרת התביעה תופיע כאן" placeholder when the title is empty. */
  preview?: boolean;
}

export const PostTitle = ({ title, preview = false }: PostTitleProps) => (
  <Typography
    variant="h5"
    component="h3"
    sx={{
      fontFamily: '"Frank Ruhl Libre", serif',
      fontWeight: 700,
      mb: 1.5,
      lineHeight: 1.3,
      color: "primary.dark",
      overflowWrap: "anywhere",
      wordBreak: "break-word",
    }}
  >
    {title || (preview ? "כותרת התביעה תופיע כאן" : "")}
  </Typography>
);
