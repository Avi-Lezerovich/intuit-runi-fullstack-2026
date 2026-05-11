import { useEffect, useState, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Tabs,
  Tab,
  Stack,
  Box,
  CircularProgress,
  Button,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import GavelIcon from "@mui/icons-material/Gavel";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import BalanceIcon from "@mui/icons-material/Balance";

import SinglePost from "../components/SinglePost";
import PostSkeleton from "../components/PostSkeleton";
import ConfirmDialog from "../components/ConfirmDialog";
import { useNotify } from "../components/Notifications";
import { fetchPosts, deletePost as apiDeletePost, getStoredUser } from "../api";
import type { Post, Sort } from "../types";

const PAGE_SIZE = 10;

// Vector icons render consistently across systems, unlike emoji that flip
// into platform-specific glyphs (the 🆕 emoji became an English "NEW" badge).
const TABS: { value: Sort; label: string; icon: JSX.Element }[] = [
  { value: "hot", label: "חם עכשיו", icon: <LocalFireDepartmentIcon /> },
  { value: "new", label: "חדש", icon: <FiberNewIcon /> },
  { value: "closed", label: "הוכרע", icon: <BalanceIcon /> },
];

const Home = () => {
  const notify = useNotify();
  const [sort, setSort] = useState<Sort>("hot");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Bumped on "retry" to force a refetch even when sort is unchanged.
  const [reloadKey, setReloadKey] = useState(0);
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Re-read user on auth change so vote/delete buttons reflect current state
  useEffect(() => {
    const refresh = () => setCurrentUser(getStoredUser());
    window.addEventListener("auth-change", refresh);
    return () => window.removeEventListener("auth-change", refresh);
  }, []);

  // Initial load + tab change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPosts([]);
    setHasMore(true);

    fetchPosts({ sort, limit: PAGE_SIZE, offset: 0 })
      .then((data) => {
        if (cancelled) return;
        setPosts(data);
        setHasMore(data.length === PAGE_SIZE);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "שגיאה לא ידועה");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sort, reloadKey]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = await fetchPosts({ sort, limit: PAGE_SIZE, offset: posts.length });
      setPosts((prev) => [...prev, ...next]);
      setHasMore(next.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה לא ידועה");
    } finally {
      setLoadingMore(false);
    }
  }, [posts.length, sort, loadingMore, hasMore]);

  const requestDelete = (id: number) => {
    const target = posts.find((p) => p.id === id);
    if (target) setPendingDelete(target);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await apiDeletePost(pendingDelete.id);
      setPosts((prev) => prev.filter((p) => p.id !== pendingDelete.id));
      notify("התביעה נמחקה מהפרוטוקול", "success");
    } catch (err) {
      notify(err instanceof Error ? err.message : "שגיאת מחיקה", "error");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  const handleVoteChange = (postId: number, guilty: number, innocent: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, guilty_votes: guilty, innocent_votes: innocent } : p,
      ),
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      {/* Headline */}
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 900, color: "primary.dark" }}
        >
          בית המשפט פתוח
        </Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.5, fontStyle: "italic" }}>
          הצבעת המושבעים בעיצומה. הצדק יקבע על ידי הקהילה.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box
        sx={{
          mb: 3,
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
          borderRadius: 1,
          boxShadow: "0 1px 3px rgba(26, 46, 79, 0.06)",
        }}
      >
        <Tabs
          value={sort}
          onChange={(_, v) => setSort(v as Sort)}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="secondary"
        >
          {TABS.map((t) => (
            <Tab
              key={t.value}
              value={t.value}
              label={t.label}
              icon={t.icon}
              iconPosition="start"
              sx={{ minHeight: 56, gap: 0.5 }}
            />
          ))}
        </Tabs>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button size="small" startIcon={<RefreshIcon />} onClick={() => setReloadKey((k) => k + 1)}>
              נסה שוב
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </Stack>
      ) : posts.length === 0 && !error ? (
        <Paper
          sx={{
            textAlign: "center",
            py: 6,
            px: 3,
            border: "2px dashed",
            borderColor: "rgba(184, 134, 11, 0.3)",
            backgroundColor: "transparent",
          }}
          elevation={0}
        >
          <Typography sx={{ fontSize: "3rem", mb: 1 }}>⚖️</Typography>
          <Typography variant="h6" sx={{ color: "text.secondary", mb: 0.5 }}>
            שקט בבית המשפט
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            אין תביעות פתוחות. אולי הגיע הזמן שתפתח/י את הראשונה?
          </Typography>
          {currentUser ? (
            <Button
              component={RouterLink}
              to="/new-post"
              variant="contained"
              color="secondary"
              startIcon={<GavelIcon />}
            >
              הגש תביעה ראשונה
            </Button>
          ) : (
            <Button component={RouterLink} to="/login" variant="contained" color="secondary">
              התייצב כדי לתבוע
            </Button>
          )}
        </Paper>
      ) : (
        <Stack spacing={2}>
          {posts.map((p) => (
            <SinglePost
              key={p.id}
              post={p}
              currentUserId={currentUser?.id}
              onDelete={requestDelete}
              onVoteChange={handleVoteChange}
            />
          ))}

          {hasMore && posts.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={loadMore}
                disabled={loadingMore}
                startIcon={loadingMore ? <CircularProgress size={18} /> : null}
              >
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
        message={
          pendingDelete
            ? `התביעה "${pendingDelete.title}" תוסר מהפרוטוקול לצמיתות. אין דרך חזרה.`
            : ""
        }
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