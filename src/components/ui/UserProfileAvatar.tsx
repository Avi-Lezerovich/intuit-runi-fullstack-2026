import { Avatar } from "@mui/material";

interface UserProfileAvatarProps {
  src?: string;
  alt?: string;
  sx?: any;
}

const UserProfileAvatar = ({ src, alt, sx }: UserProfileAvatarProps) => (
  <Avatar
    src={src}
    alt={alt}
    sx={{
      width: 60,
      height: 60,
      border: "1.5px solid",
      borderColor: "divider",
      ...(sx || {}),
    }}
  />
);

export default UserProfileAvatar;
