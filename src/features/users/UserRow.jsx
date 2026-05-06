import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import SeePostsButton from "../../components/ui/SeePostsButton";
import UserProfileAvatar from "../../components/ui/UserProfileAvatar";

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
          <UserProfileAvatar src={user.profile_image_90} alt={user.name} />
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
