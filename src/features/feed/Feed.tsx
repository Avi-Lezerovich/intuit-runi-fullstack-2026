import { Grid, CircularProgress, Box, Typography } from "@mui/material";
import SinglePost from "./SinglePost";
import LoadMoreButton from "../../components/ui/LoadMoreButton";
import { usePosts } from "./hooks/usePosts";

// Pure presentational component — all data lifecycle lives in usePosts().
const Feed = () => {
  const { posts, loading, error, hasMore, loadMore } = usePosts();

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
            <SinglePost post={post} />
          </Grid>
        ))}
      </Grid>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && hasMore && (
        <LoadMoreButton onClick={loadMore} label="Load More" />
      )}

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
