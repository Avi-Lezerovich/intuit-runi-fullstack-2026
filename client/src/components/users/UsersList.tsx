import { Link as RouterLink } from "react-router-dom";
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Box, Stack, Avatar, Typography, Button, Chip } from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { getInitials } from "../../utils/stringUtils";
import type { UserListItem } from "../../types";

interface UsersListProps {
  users: UserListItem[];
}

export const UsersList = ({ users }: UsersListProps) => {
  return (
    <>
      {/* Desktop View */}
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
                      {getInitials(u.name)}
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
                    <Typography component="span" sx={{ color: "text.secondary", fontWeight: 500 }}>—</Typography>
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
                  <Button component={RouterLink} to={`/user-posts/${u.id}`} variant="contained" size="small" startIcon={<FolderOpenIcon />}>
                    ראה תיק
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile View */}
      <Stack spacing={1.5} sx={{ display: { xs: "flex", sm: "none" } }}>
        {users.map((u) => (
          <Paper key={u.id} sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main", color: "background.default", fontWeight: 700 }}>
                {getInitials(u.name)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600 }}>{u.name}</Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                  {u.post_count === 0 ? "ללא תביעות" : `${u.post_count} תביעות · ${u.guilty_percent}% הרשעות`}
                </Typography>
              </Box>
              <Button component={RouterLink} to={`/user-posts/${u.id}`} variant="contained" size="small">
                תיק
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </>
  );
};