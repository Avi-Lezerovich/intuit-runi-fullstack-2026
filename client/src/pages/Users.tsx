// נתיב: client/src/pages/Users.tsx
import { useState } from "react";
import { Container, TextField, InputAdornment, Box, Typography, Button, CircularProgress, Alert, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import { useDebounce } from "../hooks/useDebounce";
import { useUsersList } from "../hooks/useUsersList";
import { UsersSkeleton } from "../components/users/UsersSkeleton";
import { UsersList } from "../components/users/UsersList";

const DEBOUNCE_MS = 300;

const Users = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), DEBOUNCE_MS);
  
  const { users, loading, loadingMore, hasMore, error, loadMore } = useUsersList(debouncedSearch);

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
        <UsersSkeleton />
      ) : users.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            {debouncedSearch ? "אין תוצאות לחיפוש." : "אין תובעים רשומים."}
          </Typography>
        </Box>
      ) : (
        <>
          <UsersList users={users} />

          {hasMore && (
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