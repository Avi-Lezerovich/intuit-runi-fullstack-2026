import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { fetchUsers } from '../api.js';
import UserRow from '../components/UserRow.jsx';

import LoadMoreButton from '../components/LoadMoreButton.jsx';

interface User {
  id: number;
  name: string;
  username: string;
  profile_image_90: string;
  post_count: number;
}

const mergeUniqueUsers = (previousUsers: User[], incomingUsers: User[]): User[] => {
  const seenIds = new Set(previousUsers.map((user: User) => user.id));
  const uniqueIncomingUsers = incomingUsers.filter((user: User) => !seenIds.has(user.id));

  return [...previousUsers, ...uniqueIncomingUsers];
};

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const LIMIT = 10;

  const loadUsers = async (currentPage: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchUsers(currentPage, LIMIT);
      const newUsers = result.users;

      setHasMore(result.hasMore);

      setUsers((prev) => mergeUniqueUsers(prev, newUsers));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadUsers(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadUsers(nextPage);
  };

  const handleSeePosts = (user: User) => {
    console.log(`See posts for ${user.username}`);
  };

  if (error && users.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
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
    <Divider sx={{ mb: 1 }} />
    <List disablePadding>
      {users.map((user) => (
        <UserRow key={user.id} user={user} onSeePostsClick={handleSeePosts} />
      ))}
    </List>
    {loading && (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress size={24} />
      </Box>
    )}
    {!loading && hasMore && (
      <LoadMoreButton onClick={handleLoadMore} label="Load More" />
    )}
  </Box>
);
}
