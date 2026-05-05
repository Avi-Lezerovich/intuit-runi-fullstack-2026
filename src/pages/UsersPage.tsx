import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import LoadMoreButton from "../components/ui/LoadMoreButton";
import UsersList from "../features/users/UsersList";
import { useUsers, type User } from "../features/users/hooks/useUsers";

export default function UsersPage() {
  const { users, loading, error, hasMore, loadMore } = useUsers();

  const handleSeePosts = (user: User) => {
    // TODO: route to a per-user posts page once the route exists.
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
      <Typography
        variant="overline"
        sx={{ color: "text.disabled", letterSpacing: "0.08em", fontWeight: 600 }}
      >
        Users · {users.length} shown
      </Typography>
      <UsersList users={users} onSeePostsClick={handleSeePosts} />
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {!loading && hasMore && (
        <LoadMoreButton onClick={loadMore} label="Load More" />
      )}
    </Box>
  );
}
