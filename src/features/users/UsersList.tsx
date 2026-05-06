import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import UserRow from "./UserRow";
import type { User } from "../../types";

interface UsersListProps {
  users: User[];
  onSeePostsClick: (user: User) => void;
}

// Pure presentational list of UserRows. Page-level data lives in useUsers().
const UsersList = ({ users, onSeePostsClick }: UsersListProps) => (
  <>
    <Divider sx={{ mb: 1 }} />
    <List disablePadding>
      {users.map((user) => (
        <UserRow key={user.id} user={user} onSeePostsClick={onSeePostsClick} />
      ))}
    </List>
  </>
);

export default UsersList;
