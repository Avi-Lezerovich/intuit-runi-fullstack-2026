import { useState } from "react";

import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from "@mui/material";


const SinglePost = ({ title, email, body, source, date }) => {
  const [expanded, setExpanded] = useState(false);

  // Truncate to 200 characters when collapsed
  const PREVIEW_LENGTH = 200;
  const isLong = body && body.length > PREVIEW_LENGTH;
  const shortText = isLong ? body.slice(0, PREVIEW_LENGTH).trimEnd() + "…" : body;
  const displayText = expanded ? body : shortText;

  // Format date nicely if available
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 2,
        transition: "box-shadow 0.3s",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>

        {/* Source chip + date row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, flexWrap: "wrap" }}>
          {source && (
            <Chip label={source} size="small" color="primary" variant="outlined" />
          )}
          {formattedDate && (
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
          )}
        </Box>


        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ whiteSpace: "pre-line", mt: 1 }}
        >
          {displayText}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", alignItems: "center", px: 2, pb: 1 }}>
        {isLong ? (
          <Button
            size="small"
            variant="contained"
            onClick={() => setExpanded(!expanded)}
            sx={{ textTransform: "none", borderRadius: 1 }}
          >
            {expanded ? "Show Less" : "Read More"}
          </Button>
        ) : (
          <span />
        )}
        {email && (
          <Typography variant="caption" color="text.secondary">
            {email}
          </Typography>
        )}
      </CardActions>
    </Card>
  );
};

export default SinglePost;
