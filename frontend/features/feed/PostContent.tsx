import { CardContent, Typography, Chip, Box } from "@mui/material";

interface PostContentProps {
  description: string;
  expanded: boolean;
  tagList: string[];
}

/**
 * PostContent - Renders the post content in collapsed (preview) or expanded (full) mode.
 */
const PostContent = ({ description, expanded, tagList }: PostContentProps) => {
  return (
    <CardContent>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          whiteSpace: "pre-line",
          ...(!expanded && {
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          })
        }}
      >
        {description}
      </Typography>

      {/* Render tags only when the article has any. */}
      {expanded && tagList?.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 2 }}>
          {tagList.map((tag) => (
            <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
          ))}
        </Box>
      )}
    </CardContent>
  );
};

export default PostContent;
