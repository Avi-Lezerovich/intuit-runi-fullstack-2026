import { useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Container, Typography, Stack, Alert, Button, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import SinglePost from "../components/single-post/SinglePost";
import UserProfileCard from "../components/profile/UserProfileCard";
import EmptyPostsState from "../components/profile/EmptyPostsState";
import ConfirmDialog from "../components/feedback/ConfirmDialog";
import { ProfileSkeleton } from "../components/profile/ProfileSkeleton";
import { useNotify } from "../components/feedback/Notifications";
import { deletePost as apiDeletePost } from "../api";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { useProfileData } from "../hooks/useProfileData";
import type { Post } from "../types";

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = userId ? parseInt(userId, 10) : NaN;
  const notify = useNotify();

  // Custom Hooks לניהול נתונים ולוגיקה
  const currentUser = useCurrentUser();
  const {
    user, stats, visiblePosts, hasMore, loading, error,
    loadMore, removePostFromState, updateVotesInState,
  } = useProfileData(numericUserId);

  // Local UI State עבור מודל המחיקה בלבד
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await apiDeletePost(pendingDelete.id);
      removePostFromState(pendingDelete);
      notify("התביעה נמחקה מהפרוטוקול", "success");
    } catch (err) {
      notify(err instanceof Error ? err.message : "שגיאת מחיקה", "error");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  if (loading) return <ProfileSkeleton />;

  if (error || !user || !stats) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || "התובע לא נמצא"}</Alert>
        <Button component={RouterLink} to="/users" sx={{ mt: 2 }} startIcon={<ArrowBackIcon sx={{ transform: "scaleX(-1)" }} />}>
          חזרה ללוח התובעים
        </Button>
      </Container>
    );
  }

  const isOwner = currentUser?.id === user.id;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Button
        component={RouterLink}
        to="/users"
        sx={{ mb: 2 }}
        startIcon={<ArrowBackIcon sx={{ transform: "scaleX(-1)" }} />}
      >
        כל התובעים
      </Button>

      <UserProfileCard user={user} stats={stats} currentUserId={currentUser?.id} />

      <Typography variant="h5" sx={{ mb: 2, fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 700 }}>
        תיק תביעות {user.name}
      </Typography>

      {visiblePosts.length === 0 ? (
        <EmptyPostsState isOwner={isOwner} userName={user.name} />
      ) : (
        <Stack spacing={2}>
          {visiblePosts.map((p) => (
            <SinglePost
              key={p.id}
              post={p}
              currentUserId={currentUser?.id}
              onDelete={() => setPendingDelete(p)} // פעולה ישירה שמפשטת את הקוד
              onVoteChange={updateVotesInState}
            />
          ))}

          {hasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
              <Button variant="outlined" onClick={loadMore}>
                טען עוד
              </Button>
            </Box>
          )}
        </Stack>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="מחיקת תביעה"
        message={pendingDelete ? `התביעה "${pendingDelete.title}" תוסר מהפרוטוקול לצמיתות. אין דרך חזרה.` : ""}
        confirmLabel={deleting ? "מוחק..." : "כן, למחוק"}
        cancelLabel="חזרה"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setPendingDelete(null)}
      />
    </Container>
  );
};

export default ProfilePage;