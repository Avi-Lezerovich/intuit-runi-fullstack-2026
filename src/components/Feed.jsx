import { useState, useEffect } from "react";

import {Grid, CircularProgress, Box, Button, Typography} from "@mui/material"
import SinglePost from "./SinglePost";
import { fetchPosts } from "../api";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 10;

  const loadPosts = async (startIndex) => {
    setLoading(true);
    setError(null);
    try {
      const newPosts = await fetchPosts(startIndex, LIMIT);

      if (newPosts.length < LIMIT) {
        setHasMore(false);
      }

      // Local JSON already includes email, source, and date — no extra fetch needed
      setPosts((prev) => [...prev, ...newPosts]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(0);
  }, []);

  const handleLoadMore = () => {
    const newStart = start + LIMIT;
    setStart(newStart);
    loadPosts(newStart);
  };

  if (error && posts.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid size={{ xs: 12, sm: 6 }} key={post.id}>
            <SinglePost
              title={post.title}
              email={post.email}
              body={post.body}
              source={post.source}
              date={post.date}
            />
          </Grid>
        ))}
      </Grid>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
            sx={{
              textTransform: "none",
              px: 4,
              py: 1,
              borderRadius: 2,
            }}
          >
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Feed;
