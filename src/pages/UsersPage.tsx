// src/pages/UsersPage.tsx
import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import LoadMoreButton from "../components/ui/LoadMoreButton";
import UsersList from "../features/users/UsersList";
import { useUsers, type User } from "../features/users/hooks/useUsers";
import { useUserSearch } from "../features/users/hooks/useUserSearch";
import { mergeUniqueUsers } from "../features/users/utils/mergeUniqueUsers";

export default function UsersPage() {
  const { users, loading, error, hasMore, loadMore } = useUsers();
  const [query, setQuery] = useState("");
  const { users: searchedUsers, loading: searchLoading, error: searchError } =
    useUserSearch(query);

  const trimmedQuery = query.trim();

  const visibleUsers = useMemo(() => {
    if (!trimmedQuery) {
      return users;
    }

    const localMatches = users.filter((user) => {
      const q = trimmedQuery.toLowerCase();
      return (
        user.name?.toLowerCase().includes(q) ||
        user.username?.toLowerCase().includes(q)
      );
    });

    return mergeUniqueUsers(localMatches, searchedUsers);
  }, [searchedUsers, trimmedQuery, users]);

  const handleSeePosts = (user: User) => {
    console.log(`See posts for ${user.username}`);
  };

  if (error && users.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 760, mx: "auto" }}>
      {/* Search bar */}
      <TextField
        fullWidth
        placeholder="Search by name or username…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 3 }}
        helperText={searchError ?? undefined}
        error={Boolean(searchError)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      <UsersList users={visibleUsers} onSeePostsClick={handleSeePosts} />

      {(loading || searchLoading) && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Only show Load More when not actively filtering */}
      {!loading && !searchLoading && hasMore && trimmedQuery === "" && (
        <LoadMoreButton onClick={loadMore} label="Load More" />
      )}
    </Box>
  );
}