import { Avatar } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

interface ProfilePictureProps {
  src?: string;
  alt?: string;
  sx?: SxProps<Theme>;
}

const ProfilePicture = ({ src, alt, sx }: ProfilePictureProps) => (
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

export default ProfilePicture;
