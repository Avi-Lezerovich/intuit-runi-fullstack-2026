import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { fetchUsers } from '../api';
import SeePostsButton from '../components/SeePostsButton';

const mergeUniqueUsers = (previousUsers, incomingUsers) => {
  const seenIds = new Set(previousUsers.map((user) => user.id));
  const uniqueIncomingUsers = incomingUsers.filter((user) => !seenIds.has(user.id));

  return [...previousUsers, ...uniqueIncomingUsers];
};

export default function UsersPage() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const LIMIT = 10;

  const loadUsers = async (currentPage) => {
    setLoading(true);
    setError(null);

    try {
      const newUsers = await fetchUsers(currentPage, LIMIT);

      if (newUsers.length < LIMIT) {
        setHasMore(false);
      }

      setUsers((prev) => mergeUniqueUsers(prev, newUsers));
    } catch (err) {
      setError(err.message);
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

  const handleSeePosts = (user) => {
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
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>

      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {users.map((user) => (
          <ListItem
            key={user.id}
            alignItems="center"
            divider
            sx={{ gap: 2, py: 2, flexWrap: 'wrap' }}
          >
            <ListItemAvatar>
              <Avatar alt={user.name} src={user.profile_image_90 || user.profile_image} />
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary={
                <Box component="span" sx={{ display: 'block' }}>
                  <Typography component="span" variant="body2" color="text.primary">
                    @{user.username}
                  </Typography>
                  {user.twitter_username ? (
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: 'block' }}
                    >
                      Twitter: @{user.twitter_username}
                    </Typography>
                  ) : null}
                  {user.github_username ? (
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: 'block' }}
                    >
                      GitHub: @{user.github_username}
                    </Typography>
                  ) : null}
                </Box>
              }
            />
            <Box sx={{ ml: 'auto' }}>
              <SeePostsButton onClick={() => handleSeePosts(user)} />
            </Box>
          </ListItem>
        ))}
      </List>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
            sx={{ textTransform: 'none', px: 4, py: 1, borderRadius: 2 }}
          >
            Load More
          </Button>
        </Box>
      )}

      {!loading && !hasMore && users.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No more users to load
          </Typography>
        </Box>
      )}
    </Box>
  );
}
