import { CardActions, IconButton, Typography, Box, Button } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface PostCardFooterProps {
  readingTime: number;
  isLong: boolean;
  expanded: boolean;
  onExpandToggle: () => void;
}

/**
 * PostCardFooter - Renders the card footer with reading time, share button, and expand button.
 */
const PostCardFooter = ({ readingTime, isLong, expanded, onExpandToggle }: PostCardFooterProps) => {
  return (
    <CardActions disableSpacing sx={{ px: 2, mt: "auto", pb: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", ml: 1, gap: 0.5 }}>
        <AccessTimeIcon fontSize="small" sx={{ color: "text.secondary" }} />
        <Typography variant="caption" color="text.secondary">
          {readingTime} min
        </Typography>
      </Box>

      <IconButton aria-label="share" sx={{ ml: 1 }}>
        <ShareIcon fontSize="small" />
      </IconButton>

      {isLong && (
        <Button onClick={onExpandToggle} size="small" sx={{ ml: "auto" }}>
          {expanded ? "Show less" : "Read More"}
        </Button>
      )}
    </CardActions>
  );
};

export default PostCardFooter;
