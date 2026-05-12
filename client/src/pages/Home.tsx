/**
 * Home feed — route `/`. The landing screen for the whole app.
 * Sort tabs (hot / new / closed) drive the usePostsFeed hook; the page owns only the
 * delete-confirmation modal locally. Vote and delete actions update the feed list
 * optimistically via callbacks exposed by the hook.
 */
import { useState } from "react";
import { Container, Tabs, Tab, Stack, Box, CircularProgress, Button, Typography, Alert } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import BalanceIcon from "@mui/icons-material/Balance";

import SinglePost from "../components/single-post/SinglePost";
import PostSkeleton from "../components/single-post/PostSkeleton";
import ConfirmDialog from "../components/feedback/ConfirmDialog";
import { EmptyFeedState } from "../components/feed/EmptyFeedState";
import { useNotify } from "../components/feedback/Notifications";
import { deletePost as apiDeletePost } from "../api";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { usePostsFeed } from "../hooks/usePostsFeed";
import type { Post, Sort } from "../types";

const TABS: { value: Sort; label: string; icon: JSX.Element }[] = [
  { value: "hot", label: "חם עכשיו", icon: <LocalFireDepartmentIcon /> },
  { value: "new", label: "חדש", icon: <FiberNewIcon /> },
  { value: "closed", label: "הוכרע", icon: <BalanceIcon /> },
];

const Home = () => {
  const notify = useNotify();
  const currentUser = useCurrentUser(); // שימוש ב-Hook שיצרנו בשלב הראשון!
  
  const {
    sort, setSort, posts, loading, loadingMore, hasMore, error,
    reload, loadMore, removePostFromState, updateVotesInState
  } = usePostsFeed("hot");

  const [pendingDelete, setPendingDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await apiDeletePost(pendingDelete.id);
      removePostFromState(pendingDelete.id);
      notify("התביעה נמחקה מהפרוטוקול", "success");
    } catch (err) {
      notify(err instanceof Error ? err.message : "שגיאת מחיקה", "error");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h3" component="h1" sx={{ fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 900, color: "primary.dark" }}>
          בית המשפט פתוח
        </Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.5, fontStyle: "italic" }}>
          הצבעת המושבעים בעיצומה. הצדק יקבע על ידי הקהילה.
        </Typography>
      </Box>

      <Box sx={{ mb: 3, borderBottom: 1, borderColor: "divider", backgroundColor: "background.paper", borderRadius: 1, boxShadow: "0 1px 3px rgba(26, 46, 79, 0.06)" }}>
        <Tabs value={sort} onChange={(_, v) => setSort(v as Sort)} variant="fullWidth" textColor="primary" indicatorColor="secondary">
          {TABS.map((t) => (
            <Tab key={t.value} value={t.value} label={t.label} icon={t.icon} iconPosition="start" sx={{ minHeight: 56, gap: 0.5 }} />
          ))}
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} action={<Button size="small" startIcon={<RefreshIcon />} onClick={reload}>נסה שוב</Button>}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)}
        </Stack>
      ) : posts.length === 0 && !error ? (
        <EmptyFeedState isLoggedIn={!!currentUser} />
      ) : (
        <Stack spacing={2}>
          {posts.map((p) => (
            <SinglePost
              key={p.id}
              post={p}
              currentUserId={currentUser?.id}
              onDelete={() => setPendingDelete(p)}
              onVoteChange={updateVotesInState}
            />
          ))}

          {hasMore && posts.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
              <Button variant="outlined" size="large" onClick={loadMore} disabled={loadingMore} startIcon={loadingMore ? <CircularProgress size={18} /> : null}>
                {loadingMore ? "טוען..." : "טען עוד תביעות"}
              </Button>
            </Box>
          )}

          {!hasMore && posts.length > 0 && (
            <Typography variant="caption" sx={{ textAlign: "center", color: "text.secondary", py: 2 }}>
              ⚖️ הגעת לסוף הפרוטוקול
            </Typography>
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

export default Home;