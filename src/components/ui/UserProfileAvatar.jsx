import { Avatar } from "@mui/material";

const UserProfileAvatar = ({ src, alt }) => (
  <Avatar
    src={src}
    alt={alt}
    sx={{
      width: 60,
      height: 60,
      border: "1.5px solid",
      borderColor: "divider",
    }}
  />
);

export default UserProfileAvatar;
