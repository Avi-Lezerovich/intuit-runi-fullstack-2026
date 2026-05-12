import { Card, CardContent, Skeleton, Stack, Box } from "@mui/material";

/**
 * Placeholder shimmer for a lawsuit card while the feed loads.
 * Mirrors the rough shape of <SinglePost /> so the layout doesn't jump on swap.
 */
const PostSkeleton = () => {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="25%" height={14} />
          </Box>
        </Stack>
        <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1.5 }} />
        <Skeleton variant="rectangular" height={48} sx={{ mb: 1.5, borderRadius: 1 }} />
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <Skeleton variant="rounded" width={90} height={24} />
          <Skeleton variant="rounded" width={120} height={24} />
        </Stack>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="95%" />
        <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={10} sx={{ borderRadius: 5 }} />
      </CardContent>
    </Card>
  );
};
export default PostSkeleton;
