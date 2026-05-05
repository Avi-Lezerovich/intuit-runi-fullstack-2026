import { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Card, CardHeader, CardMedia, CardContent, CardActions,
  Collapse, Avatar, IconButton, Typography, Chip, Box
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { POST_PREVIEW_LENGTH } from "../../constants/config";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    { props: ({ expand }) => !expand, style: { transform: "rotate(0deg)" } },
    { props: ({ expand }) => !!expand, style: { transform: "rotate(180deg)" } },
  ],
}));

// `post` is the article object returned by the dev.to API.
const SinglePost = ({ post }) => {
  const [expanded, setExpanded] = useState(false);

  const {
    title,
    description,
    cover_image,
    readable_publish_date,
    tag_list,
    reading_time_minutes,
    public_reactions_count,
    comments_count,
    url,
    user,
    organization,
  } = post;

  // Prefer the organization name and avatar when they exist; otherwise fall back to the user.
  const displayName = organization?.name || user?.name || "";
  const avatarImage = organization?.profile_image_90 || user?.profile_image_90 || "";
  const avatarLetter = displayName?.charAt(0).toUpperCase();

  // Shorten the description so the card has a compact default state.
  const isLong = description && description.length > POST_PREVIEW_LENGTH;
  const cutIndex = isLong ? description.lastIndexOf(" ", POST_PREVIEW_LENGTH) : POST_PREVIEW_LENGTH;
  const shortText = isLong ? description.slice(0, cutIndex).trimEnd() : description;

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        transition: "box-shadow 0.3s",
        "&:hover": { boxShadow: 4 },
      }}
    >
      {/* Card header with the author avatar, title, and publish date. */}
      <CardHeader
        avatar={
          <Avatar
            src={avatarImage}
            sx={{ bgcolor: "primary.main" }}
            aria-label="author"
          >
            {!avatarImage && avatarLetter}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography
            variant="subtitle1"
            component="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              fontWeight: 600,
              textDecoration: "none",
              color: "text.primary",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {title}
          </Typography>
        }
        subheader={
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mt: 0.5 }}>
            <Chip label={displayName} size="small" color="primary" variant="outlined" />
            <Typography variant="caption" color="text.secondary">
              {readable_publish_date}
            </Typography>
          </Box>
        }
      />

      {/* Show the cover image only when the API provides one. */}
      {cover_image && (
        <CardMedia
          component="img"
          height="180"
          image={cover_image}
          alt={title}
          sx={{ objectFit: "cover" }}
        />
      )}

      {/* Render the short preview while the card is collapsed. */}
      {!expanded && (
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
            {shortText}{isLong && "…"}
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
          {tag_list?.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 2 }}>
              {tag_list.map((tag) => (
                <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
              ))}
            </Box>
          )}
        </CardContent>
      </Collapse>

      {/* Footer actions and metadata for the post card. */}
      <CardActions disableSpacing sx={{ px: 2, mt: "auto" }}>
        
        <Box sx={{ display: "flex", alignItems: "center", ml: 1, gap: 0.5 }}>
          <AccessTimeIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            {reading_time_minutes} min
          </Typography>
        </Box>

        <IconButton aria-label="share" sx={{ ml: 1 }}>
          <ShareIcon fontSize="small" />
        </IconButton>

        {isLong && (
          <ExpandMore
            expand={expanded}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        )}
      </CardActions>
    </Card>
  );
};

export default SinglePost;