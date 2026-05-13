/**
 * Lawsuit title — serif H3 with brand styling.
 * In preview mode shows a "כותרת התביעה תופיע כאן" placeholder so the empty form looks alive.
 */
import { Typography } from "@mui/material";
import { DOC_FONT } from "../../theme";

interface PostTitleProps {
  title: string;
  /** In preview mode, shows a "כותרת התביעה תופיע כאן" placeholder when the title is empty. */
  preview?: boolean;
}

/**
 * Renders the lawsuit title in serif font (Frank Ruhl Libre).
 * Shows a Hebrew placeholder in preview mode when the title field is empty.
 * @param title - The lawsuit title text to display.
 * @param preview - If true, shows placeholder text when empty (used by NewPost preview).
 */
export const PostTitle = ({ title, preview = false }: PostTitleProps) => (
  <Typography
    variant="h5"
    component="h3"
    sx={{
      fontFamily: DOC_FONT,
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
