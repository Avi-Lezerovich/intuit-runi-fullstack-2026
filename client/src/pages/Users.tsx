import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Skeleton,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import { fetchUsers } from "../api";
import type { UserListItem } from "../types";

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 300;

function initials(name: string): string {
  return name.split(/\s+/).map((p) => p[0]).filter(Boolean).slice(0, 2).join("");
}
const Users = () => {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce the search input (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search]);

  // Reload list when debounced search changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setUsers([]);
    setHasMore(true);

    fetchUsers({ search: debounced, limit: PAGE_SIZE, offset: 0 })
      .then((data) => {
        if (cancelled) return;
        setUsers(data);
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
  }, [debounced]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = await fetchUsers({
        search: debounced,
        limit: PAGE_SIZE,
        offset: users.length,
      });
      setUsers((prev) => [...prev, ...next]);
      setHasMore(next.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה לא ידועה");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h3" component="h1" sx={{ fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 900, color: "primary.dark" }}>
          לוח התובעים
        </Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.5, fontStyle: "italic" }}>
          רשימת כל מי שהביא תביעה לבית המשפט. חפש שם או אימייל.
        </Typography>
      </Box>

      <TextField
        fullWidth
        placeholder="חיפוש לפי שם או אימייל..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, backgroundColor: "background.paper" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
          endAdornment: search ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearch("")} aria-label="נקה חיפוש">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <>
          <TableContainer component={Paper} sx={{ display: { xs: "none", sm: "block" } }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "primary.main" }}>
                  <TableCell sx={{ color: "background.default", fontWeight: 700 }}>תובע</TableCell>
                  <TableCell align="center" sx={{ color: "background.default", fontWeight: 700 }}>תביעות</TableCell>
                  <TableCell align="center" sx={{ color: "background.default", fontWeight: 700 }}>% הרשעות</TableCell>
                  <TableCell align="center" sx={{ color: "background.default", fontWeight: 700 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="60%" />
                          <Skeleton variant="text" width="40%" height={14} />
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="center"><Skeleton variant="text" width={24} sx={{ mx: "auto" }} /></TableCell>
                    <TableCell align="center"><Skeleton variant="rounded" width={56} height={24} sx={{ mx: "auto" }} /></TableCell>
                    <TableCell align="center"><Skeleton variant="rounded" width={86} height={32} sx={{ mx: "auto" }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack spacing={1.5} sx={{ display: { xs: "flex", sm: "none" } }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Paper key={i} sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="50%" height={14} />
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </>
      ) : users.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            {debounced ? "אין תוצאות לחיפוש." : "אין תובעים רשומים."}
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ display: { xs: "none", sm: "block" } }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "primary.main" }}>
                  <TableCell sx={{ color: "background.default", fontWeight: 700, fontSize: "1rem" }}>תובע</TableCell>
                  <TableCell align="center" sx={{ color: "background.default", fontWeight: 700 }}>תביעות</TableCell>
                  <TableCell align="center" sx={{ color: "background.default", fontWeight: 700 }}>% הרשעות</TableCell>
                  <TableCell align="center" sx={{ color: "background.default", fontWeight: 700 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: "primary.main", color: "background.default", fontWeight: 700 }}>
                          {initials(u.name)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, color: "primary.dark" }}>{u.name}</Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>{u.email}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: "1.05rem" }}>{u.post_count}</TableCell>
                    <TableCell align="center">
                      {u.post_count === 0 ? (
                        <Typography
                          component="span"
                          sx={{ color: "text.secondary", fontWeight: 500 }}
                          aria-label="ללא תביעות"
                        >
                          —
                        </Typography>
                      ) : (
                        <Chip
                          label={`${u.guilty_percent}%`}
                          size="small"
                          color={u.guilty_percent >= 50 ? "error" : "default"}
                          sx={{ fontWeight: 700, minWidth: 56 }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        component={RouterLink}
                        to={`/user-posts/${u.id}`}
                        variant="contained"
                        size="small"
                        startIcon={<FolderOpenIcon />}
                      >
                        ראה תיק
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Mobile: card list instead of table */}
          <Stack spacing={1.5} sx={{ display: { xs: "flex", sm: "none" } }}>
            {users.map((u) => (
              <Paper key={u.id} sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: "primary.main", color: "background.default", fontWeight: 700 }}>
                    {initials(u.name)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600 }}>{u.name}</Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                      {u.post_count === 0
                        ? "ללא תביעות"
                        : `${u.post_count} תביעות · ${u.guilty_percent}% הרשעות`}
                    </Typography>
                  </Box>
                  <Button component={RouterLink} to={`/user-posts/${u.id}`} variant="contained" size="small">
                    תיק
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>

          {hasMore && users.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 3 }}>
              <Button
                variant="outlined"
                onClick={loadMore}
                disabled={loadingMore}
                startIcon={loadingMore ? <CircularProgress size={18} /> : null}
              >
                {loadingMore ? "טוען..." : "טען עוד"}
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};
export default Users;
