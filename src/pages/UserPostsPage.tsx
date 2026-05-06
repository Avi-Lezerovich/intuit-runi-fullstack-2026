import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LanguageIcon from "@mui/icons-material/Language";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { usePosts } from "../features/feed/hooks/usePosts";
import ProfilePicture from "../components/ui/ProfilePicture";
import SinglePost from "../features/feed/SinglePost";
import LoadMoreButton from "../components/ui/LoadMoreButton";
import { fetchUserPostCount } from "../api/users";

const UserPostsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [totalEstimated, setTotalEstimated] = useState<number | null>(null);

  const { posts, loading, error, hasMore, loadMore } = usePosts(userId);

  useEffect(() => {
    let mounted = true;
    const loadCount = async () => {
      if (!userId) return;
      try {
        const count = await fetchUserPostCount(userId);
        if (mounted) setTotalEstimated(count);
      } catch {
        // ignore
      }
    };

    // Only load count when we don't have an exact count from pagination
    if (!hasMore) {
      setTotalEstimated(posts.length);
    } else {
      loadCount();
    }

    return () => {
      mounted = false;
    };
  }, [userId, posts.length, hasMore]);

  const author: any = posts.length > 0 ? posts[0].user : null;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Button component={RouterLink} to="/users" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
        Back to Authors
      </Button>

      {loading && posts.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <>
          {author && (
            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: 3,
                p: { xs: 2, md: 4 },
                mb: 4,
                display: "flex",
                gap: 3,
                alignItems: "center",
              }}
            >
              <ProfilePicture src={author.profile_image_90} alt={author.name} sx={{ width: 96, height: 96, borderWidth: 4 }} />

              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                  {author.name}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  @{author.username}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  {author.github_username && (
                    <IconButton
                      component="a"
                      href={`https://github.com/${author.github_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                    >
                      <GitHubIcon />
                    </IconButton>
                  )}
                  {author.twitter_username && (
                    <IconButton
                      component="a"
                      href={`https://twitter.com/${author.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                    >
                      <XIcon />
                    </IconButton>
                  )}
                  {author.linkedin_username && (
                    <IconButton
                      component="a"
                      href={`https://linkedin.com/in/${author.linkedin_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                    >
                      <LinkedInIcon />
                    </IconButton>
                  )}
                  {author.website_url && (
                    <IconButton
                      component="a"
                      href={author.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                    >
                      <LanguageIcon />
                    </IconButton>
                  )}
                </Stack>

                <Box sx={{ display: "inline-flex", bgcolor: "primary.light", color: "primary.main", px: 2, py: 0.75, borderRadius: 2, fontWeight: 600 }}>
                  {totalEstimated !== null ? `${totalEstimated} Articles Published` : `${posts.length}+ Articles`}
                </Box>
              </Box>
            </Box>
          )}

          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Articles by {author?.name || userId}
            </Typography>

            {error && (
              <Box sx={{ bgcolor: "error.lighter", color: "error.main", p: 2, borderRadius: 1, mb: 3 }}>
                <Typography sx={{ fontWeight: 600 }}>Error loading articles</Typography>
                <Typography variant="body2">{(error as any).toString()}</Typography>
              </Box>
            )}

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 3 }}>
              {posts.map((post) => (
                <Box key={post.id}>
                  <SinglePost post={post} />
                </Box>
              ))}
            </Box>

            {loading && posts.length > 0 && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {!loading && hasMore && (
              <Box sx={{ mt: 3 }}>
              <LoadMoreButton onClick={loadMore} label={`Load More from @${userId}`} />
            </Box>
            )}

            {!loading && !hasMore && posts.length === 0 && (
              <Box sx={{ textAlign: "center", py: 8, mt: 2, bgcolor: "background.paper", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                <Typography color="text.secondary">No articles found for this user.</Typography>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default UserPostsPage;
