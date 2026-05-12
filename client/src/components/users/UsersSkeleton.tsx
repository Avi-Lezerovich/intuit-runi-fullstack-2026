import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Box, Stack, Skeleton } from "@mui/material";

/** Renders the loading skeleton for /users — mirrors the same desktop / mobile split as <UsersList />. */
export const UsersSkeleton = () => (
  <>
    {/* Desktop Skeleton */}
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

    {/* Mobile Skeleton */}
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
);