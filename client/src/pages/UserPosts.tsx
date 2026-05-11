import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Stack,
  Paper,
  Divider,
  Skeleton,
  Alert,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GavelIcon from "@mui/icons-material/Gavel";

import SinglePost from "../components/SinglePost";
import PostSkeleton from "../components/PostSkeleton";
import ConfirmDialog from "../components/ConfirmDialog";
import { useNotify } from "../components/Notifications";
import { fetchUserProfile, deletePost as apiDeletePost, getStoredUser } from "../api";
import type { Post, User, UserStats } from "../types";

function initials(name: string): string {
  return name.split(/\s+/).map((p) => p[0]).filter(Boolean).slice(0, 2).join("");
}

const HEBREW_DATE = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const PAGE_SIZE = 10;

const UserPosts = () => {
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = userId ? parseInt(userId, 10) : NaN;
  const notify = useNotify();

  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Re-read user on auth changes (so owner-actions appear/disappear correctly)
  useEffect(() => {
    const refresh = () => setCurrentUser(getStoredUser());
    window.addEventListener("auth-change", refresh);
    return () => window.removeEventListener("auth-change", refresh);
  }, []);

  useEffect(() => {
    if (Number.isNaN(numericUserId)) {
      setError("מזהה תובע לא תקין");
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchUserProfile(numericUserId)
      .then((data) => {
        if (cancelled) return;
        setUser(data.user);
        setStats(data.stats);
        setAllPosts(data.posts);
        setVisibleCount(PAGE_SIZE);
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
  }, [numericUserId]);

  const requestDelete = (id: number) => {
    const target = allPosts.find((p) => p.id === id);
    if (target) setPendingDelete(target);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await apiDeletePost(pendingDelete.id);
      const deleted = pendingDelete;
      setAllPosts((prev) => prev.filter((p) => p.id !== deleted.id));
      setStats((s) => {
        if (!s) return s;
        const wasGuilty = deleted.guilty_votes > deleted.innocent_votes;
        const total = Math.max(0, s.total - 1);
        const guilty = Math.max(0, s.guilty - (wasGuilty ? 1 : 0));
        const innocent = Math.max(0, s.innocent - (wasGuilty ? 0 : 1));
        const success_percent = total ? Math.round((guilty / total) * 100) : 0;
        return { total, guilty, innocent, success_percent };
      });
      notify("התביעה נמחקה מהפרוטוקול", "success");
    } catch (err) {
      notify(err instanceof Error ? err.message : "שגיאת מחיקה", "error");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  const handleVoteChange = (postId: number, guilty: number, innocent: number) => {
    setAllPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, guilty_votes: guilty, innocent_votes: innocent } : p)),
    );
  };

  const visiblePosts = allPosts.slice(0, visibleCount);
  const hasMore = visibleCount < allPosts.length;

  if (loading) {
    return (
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
  }

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

      {/* Profile card */}
      <Paper sx={{ p: { xs: 2, sm: 4 }, mb: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "primary.main",
              color: "background.default",
              width: 80,
              height: 80,
              fontSize: "1.75rem",
              fontWeight: 700,
              border: "3px solid",
              borderColor: "secondary.main",
            }}
          >
            {initials(user.name)}
          </Avatar>
          <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "right" } }}>
            <Typography
              variant="h4"
              sx={{ fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 700, color: "primary.dark" }}
            >
              {user.name}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>{user.email}</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5 }}>
              חבר/ה במערכת מאז {HEBREW_DATE.format(new Date(user.created_at))}
            </Typography>
            {currentUser?.id === user.id && (
              <Button
                component={RouterLink}
                to="/new-post"
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<GavelIcon />}
                sx={{ mt: 1.5 }}
              >
                הגש תביעה חדשה
              </Button>
            )}
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={2} justifyContent="space-around">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" sx={{ fontFamily: '"Frank Ruhl Libre", serif', color: "primary.main", fontWeight: 700 }}>
              {stats.total}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: 1 }}>
              סה״כ תביעות
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" sx={{ fontFamily: '"Frank Ruhl Libre", serif', color: "error.main", fontWeight: 700 }}>
              {stats.guilty}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: 1 }}>
              הרשעות
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" sx={{ fontFamily: '"Frank Ruhl Libre", serif', color: "secondary.dark", fontWeight: 700 }}>
              {stats.success_percent}%
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: 1 }}>
              שיעור הצלחה
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Typography variant="h5" sx={{ mb: 2, fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 700 }}>
        תיק תביעות {user.name}
      </Typography>

      {visiblePosts.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            py: 6,
            px: 3,
            border: "2px dashed",
            borderColor: "rgba(184, 134, 11, 0.3)",
            backgroundColor: "transparent",
          }}
        >
          <Typography sx={{ fontSize: "3rem", mb: 1 }}>📭</Typography>
          {currentUser?.id === user.id ? (
            <>
              <Typography variant="h6" sx={{ color: "text.secondary", mb: 0.5 }}>
                עדיין לא הגשת תביעות
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                התסכולים ממתינים. הגיע הזמן לכתוב כתב אישום ראשון.
              </Typography>
              <Button
                component={RouterLink}
                to="/new-post"
                variant="contained"
                color="secondary"
                startIcon={<GavelIcon />}
              >
                הגש תביעה ראשונה
              </Button>
            </>
          ) : (
            <Typography variant="h6" sx={{ color: "text.secondary" }}>
              {user.name} עדיין לא הגיש/ה תביעות לבית המשפט
            </Typography>
          )}
        </Paper>
      ) : (
        <Stack spacing={2}>
          {visiblePosts.map((p) => (
            <SinglePost
              key={p.id}
              post={p}
              currentUserId={currentUser?.id}
              onDelete={requestDelete}
              onVoteChange={handleVoteChange}
            />
          ))}

          {hasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
              <Button variant="outlined" onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}>
                טען עוד
              </Button>
            </Box>
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
export default UserPosts;
