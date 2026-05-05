// import Avatar from "@mui/material/Avatar";
// import Box from "@mui/material/Box";
// import Chip from "@mui/material/Chip";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import SeePostsButton from "./SeePostsButton";

// const UserRow = ({ user, onSeePostsClick }) => {
//   return (
//     <>
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           px: 3,
//           py: 2,
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <Avatar
//             src={user.profile_image_90}
//             alt={user.name}
//             sx={{ width: 48, height: 48 }}
//           />
//           <Box>
//             <Typography fontWeight={600} fontSize={15}>
//               {user.name}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               @{user.username}
//             </Typography>
//           </Box>
//         </Box>

//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <Chip
//             label={`${user.post_count} posts`}
//             size="small"
//             sx={{
//               backgroundColor: "action.hover",
//               fontWeight: 500,
//             }}
//           />
//           <SeePostsButton onClick={() => onSeePostsClick(user.username)} />
//         </Box>
//       </Box>
//       <Divider />
//     </>
//   );
// };

// export default UserRow;


import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import SeePostsButton from "./SeePostsButton";

const UserRow = ({ user, onSeePostsClick }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderRadius: 2,
          transition: "background 0.15s",
          "&:hover": { bgcolor: "action.hover" },
          cursor: "pointer",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            src={user.profile_image_90}
            alt={user.name}
            sx={{
              width: 44,
              height: 44,
              border: "1.5px solid",
              borderColor: "divider",
            }}
          />
          <Box>
            <Typography fontWeight={600} fontSize={14} lineHeight={1.3}>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              @{user.username}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Chip
            label={`${user.post_count.toLocaleString()} posts`}
            size="small"
            sx={{
              height: 24,
              fontSize: 11,
              fontWeight: 500,
              bgcolor: "action.hover",
              border: "0.5px solid",
              borderColor: "divider",
              color: "text.secondary",
            }}
          />
          <SeePostsButton onClick={() => onSeePostsClick(user.username)} />
        </Box>
      </Box>
      <Divider />
    </>
  );
};

export default UserRow;