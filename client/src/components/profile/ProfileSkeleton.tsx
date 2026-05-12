/**
 * Loading placeholder for the ProfilePage route — mirrors the shape of the real layout:
 * profile card (avatar + name + stats row) plus a couple of post skeletons underneath.
 * Reuses <PostSkeleton /> so the post placeholders look identical to the feed's.
 */
import { Container, Skeleton, Paper, Stack, Box, Divider } from "@mui/material";
import PostSkeleton from "../single-post/PostSkeleton";

export const ProfileSkeleton = () => (
  <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
    <Skeleton variant="text" width={140} height={32} sx={{ mb: 2 }} />
    <Paper sx={{ p: { xs: 2, sm: 4 }, mb: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
        <Skeleton variant="circular" width={80} height={80} />
        <Box sx={{ flex: 1, width: "100%" }}>
          <Skeleton variant="text" width="50%" height={36} />
          <Skeleton variant="text" width="35%" height={20} />
        </Box>
      </Stack>
      <Divider sx={{ my: 3 }} />
      <Stack direction="row" spacing={2} justifyContent="space-around">
        {[0, 1, 2].map((i) => (
          <Box key={i} sx={{ textAlign: "center", flex: 1 }}>
            <Skeleton variant="text" height={56} sx={{ mx: "auto", width: "40%" }} />
            <Skeleton variant="text" height={14} sx={{ mx: "auto", width: "60%" }} />
          </Box>
        ))}
      </Stack>
    </Paper>
    <Stack spacing={2}>
      {[0, 1].map((i) => (
        <PostSkeleton key={i} />
      ))}
    </Stack>
  </Container>
);