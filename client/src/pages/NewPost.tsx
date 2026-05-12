/**
 * New lawsuit page — route `/new-post`. Guarded by <ProtectedRoute /> in App.tsx,
 * so currentUser is always defined when this renders (despite the typing).
 * Two-pane layout: form on one side, live preview on the other. All form state,
 * validation, charge-toggling, and submit live in useNewPostForm — both panes
 * share the same hook instance so the preview stays in sync as the user types.
 */
import { Container, Box, Typography, Stack } from "@mui/material";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useNewPostForm } from "../hooks/useNewPostForm";
import { CreatePostForm } from "../components/new-post/CreatePostForm";
import { PostPreviewPanel } from "../components/new-post/PostPreviewPanel";

const NewPost = () => {
  const currentUser = useCurrentUser();
  const formHookData = useNewPostForm(currentUser);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h3" component="h1" sx={{ fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 900, color: "primary.dark" }}>
          הגשת תביעה
        </Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.5, fontStyle: "italic" }}>
          מלא את כתב האישום בקפדנות. הקהילה תכריע.
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="flex-start">
        <CreatePostForm hookData={formHookData} authorName={currentUser?.name || ""} />
        <PostPreviewPanel previewPost={formHookData.previewPost} />
      </Stack>
    </Container>
  );
};

export default NewPost;
