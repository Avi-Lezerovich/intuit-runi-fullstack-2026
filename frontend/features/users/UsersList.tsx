import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import UserCard from "./UserCard";
import type { User } from "../../types";

interface UsersListProps {
  users: User[];
  onSeePostsClick: (user: User) => void;
}

// Pure presentational list of UserRows. Page-level data lives in useUsers().
const UsersList = ({ users, onSeePostsClick }: UsersListProps) => (
  <>
    <Divider sx={{ mb: 1 }} />

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(1, minmax(0, 1fr))",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
        },
        gap: 2,
        mt: 1,
      }}
    >
      {users.map((user) => (
        <UserCard key={user.id} user={user} onSeePostsClick={onSeePostsClick} />
      ))}
    </Box>
  </>
);

export default UsersList;
