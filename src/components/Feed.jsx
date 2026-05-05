import { useState, useEffect } from "react";
import { Grid, CircularProgress, Box, Button, Typography } from "@mui/material";
import SinglePost from "./SinglePost";
import { fetchPosts } from "../api";

import LoadMoreButton from "./LoadMoreButton";
// Merge new posts into the current list while skipping duplicate ids.
// This keeps the feed stable if the same page is fetched twice in development StrictMode.
const mergeUniquePosts = (previousPosts, incomingPosts) => {
  const seenIds = new Set(previousPosts.map((post) => post.id));
  const uniqueIncomingPosts = incomingPosts.filter((post) => !seenIds.has(post.id));

  return [...previousPosts, ...uniqueIncomingPosts];
};

const Feed = () => {
  // UI state for the feed content and the async loading lifecycle.
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Tracks the current page number so Load More can fetch the next batch.
  const [page, setPage] = useState(1);
  // When false, the button is hidden because the API returned the last page.
  const [hasMore, setHasMore] = useState(true);

  // Fetch 10 posts at a time so the layout shows 5 cards on each side.
  const LIMIT = 10;

  // Load one page of posts and append it to the existing list.
  const loadPosts = async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const newPosts = await fetchPosts(currentPage, LIMIT);

      // If the API returns fewer items than requested, there are no more pages left.
      if (newPosts.length < LIMIT) {
        setHasMore(false);
      }

      // Append new unique posts to the existing feed.
      setPosts((prev) => mergeUniquePosts(prev, newPosts));
    } catch (err) {
      // Store the error so the UI can show a message when the first fetch fails.
      setError(err.message);
    } finally {
      // Always clear the spinner after the request finishes.
      setLoading(false);
    }
  };

  // Run the first fetch when the component mounts.
  useEffect(() => {
    loadPosts(1);
  }, []);

  // Ask for the next page and keep the current results on screen.
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage);
  };

  // If the initial load fails, show a full-width error state instead of the feed.
  if (error && posts.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      {/* Two-column responsive grid for post cards. */}
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid size={{ xs: 12, sm: 6 }} key={post.id}>
            {/* Pass the full post object to keep the card component simple. */}
            <SinglePost post={post} />
          </Grid>
        ))}
      </Grid>

      {/* Show a spinner while a page request is in flight. */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Show the Load More button only while more pages exist. */}
      {!loading && hasMore && (
        <LoadMoreButton onClick={handleLoadMore} label="Load More" />
      )}

      {/* Show a small end-of-feed message after the last page is loaded. */}
      {!loading && !hasMore && posts.length > 0 && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No more posts to load
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Feed;