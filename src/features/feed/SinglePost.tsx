import React, { useState } from "react";
import { Card, CardMedia } from "@mui/material";
import { POST_PREVIEW_LENGTH } from "../../constants/config";
import { truncateText } from "../../utils/textUtils";
import { getAuthorInfo } from "../../utils/authorUtils";
import PostCardHeader from "./PostCardHeader";
import PostContent from "./PostContent";
import PostCardFooter from "./PostCardFooter";

import type { Article } from "../../types";

interface SinglePostProps {
  post: Article;
}

// `post` is the article object returned by the dev.to API.
const SinglePost = ({ post }: SinglePostProps) => {
  const [expanded, setExpanded] = useState(false);

  const {
    title,
    description,
    cover_image,
    readable_publish_date,
    tag_list,
    reading_time_minutes,
    url,
    user,
    organization,
  } = post;

  // Extract author information, preferring organization over user
  const { displayName, avatarImage, avatarLetter } = getAuthorInfo(user, organization);

  // Truncate description for preview
  const { truncated: shortText, isLong } = truncateText(description, POST_PREVIEW_LENGTH);

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
      <PostCardHeader
        title={title}
        url={url}
        displayName={displayName}
        avatarImage={avatarImage}
        avatarLetter={avatarLetter}
        publishDate={readable_publish_date}
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

      {/* Render the post content (short preview or full text with tags). */}
      <PostContent
        description={description}
        expanded={expanded}
        tagList={tag_list}
      />

      {/* Footer actions and metadata for the post card. */}
      <PostCardFooter
        readingTime={reading_time_minutes}
        isLong={isLong}
        expanded={expanded}
        onExpandToggle={() => setExpanded(!expanded)}
      />
    </Card>
  );
};

export default React.memo(SinglePost);