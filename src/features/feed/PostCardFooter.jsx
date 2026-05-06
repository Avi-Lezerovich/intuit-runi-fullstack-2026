import { styled } from "@mui/material/styles";
import { CardActions, IconButton, Typography, Box } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const ExpandMore = styled((props) => <IconButton {...props} />)(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    { props: ({ expand }) => !expand, style: { transform: "rotate(0deg)" } },
    { props: ({ expand }) => !!expand, style: { transform: "rotate(180deg)" } },
  ],
}));

/**
 * PostCardFooter - Renders the card footer with reading time, share button, and expand button.
 */
const PostCardFooter = ({ readingTime, isLong, expanded, onExpandToggle }) => {
  return (
    <CardActions disableSpacing sx={{ px: 2, mt: "auto" }}>
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
        <ExpandMore
          expand={expanded}
          onClick={onExpandToggle}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      )}
    </CardActions>
  );
};

export default PostCardFooter;
