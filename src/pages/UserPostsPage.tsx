import { useParams, Link as RouterLink } from "react-router-dom";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { usePosts } from "../features/feed/hooks/usePosts";
import SinglePost from "../features/feed/SinglePost";
import LoadMoreButton from "../components/ui/LoadMoreButton";
import UserProfileHeader from "../features/users/UserProfileHeader";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";
import PageLoader from "../components/ui/PageLoader";
import { useUserPostCount } from "../features/users/hooks/useUserPostCount";
import type { UserProfile } from "../types";

const UserPostsPage = () => {
  const { userId } = useParams<{ userId: string }>();

  const { posts, loading, error, hasMore, loadMore } = usePosts(userId);
  const totalEstimated = useUserPostCount(userId, hasMore, posts.length);
  const author: UserProfile | null = posts.length > 0 ? posts[0].user : null;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Button component={RouterLink} to="/users" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
        Back to Users
      </Button>

      {loading && posts.length === 0 ? (
        <PageLoader />
      ) : (
        <>
          <UserProfileHeader author={author} totalEstimated={totalEstimated} postsLength={posts.length} />

          <Box>
            {error && (
              <ErrorMessage title="Error loading articles" message={error} />
            )}

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 3 }}>
              {posts.map((post) => (
                <Box key={post.id}>
                  <SinglePost post={post} />
                </Box>
              ))}
            </Box>

            {loading && posts.length > 0 && (
              <PageLoader size={32} py={4} />
            )}

            {!loading && hasMore && (
              <Box sx={{ mt: 3 }}>
                <LoadMoreButton onClick={loadMore} label={`Load More from @${userId}`} />
              </Box>
            )}

            {!loading && !hasMore && posts.length === 0 && (
              <EmptyState
                title="No articles found"
                description="This author has no published articles yet."
              />
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default UserPostsPage;
