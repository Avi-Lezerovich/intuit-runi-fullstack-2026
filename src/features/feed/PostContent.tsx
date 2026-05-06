import { CardContent, Collapse, Typography, Chip, Box } from "@mui/material";

interface PostContentProps {
  description: string;
  shortText: string;
  expanded: boolean;
  isLong: boolean;
  tagList: string[];
}

/**
 * PostContent - Renders the post content in collapsed (preview) or expanded (full) mode.
 */
const PostContent = ({ description, shortText, expanded, isLong, tagList }: PostContentProps) => {
  return (
    <>
      {/* Render the short preview while the card is collapsed. */}
      {!expanded && (
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
            {shortText}
            {isLong && "…"}
          </Typography>
        </CardContent>
      )}

      {/* Render the full article body when the card is expanded. */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
            {description}
          </Typography>

          {/* Render tags only when the article has any. */}
          {tagList?.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 2 }}>
              {tagList.map((tag) => (
                <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
              ))}
            </Box>
          )}
        </CardContent>
      </Collapse>
    </>
  );
};

export default PostContent;
