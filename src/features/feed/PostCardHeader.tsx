import { CardHeader, IconButton, Typography, Chip, Box } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AuthorAvatar from "../../components/ui/AuthorAvatar";

interface PostCardHeaderProps {
  title: string;
  url: string;
  displayName: string;
  avatarImage?: string;
  avatarLetter?: string;
  publishDate: string;
}

/**
 * PostCardHeader - Renders the card header with author avatar, title, and publish date.
 */
const PostCardHeader = ({ title, url, displayName, avatarImage, avatarLetter, publishDate }: PostCardHeaderProps) => {
  return (
    <CardHeader
      avatar={<AuthorAvatar src={avatarImage} letter={avatarLetter} />}
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
            {publishDate}
          </Typography>
        </Box>
      }
    />
  );
};

export default PostCardHeader;
