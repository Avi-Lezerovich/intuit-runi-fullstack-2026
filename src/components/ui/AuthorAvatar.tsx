import { Avatar } from "@mui/material";

interface AuthorAvatarProps {
  src?: string;
  letter?: string;
  ariaLabel?: string;
}

const AuthorAvatar = ({ src, letter, ariaLabel = "author" }: AuthorAvatarProps) => (
  <Avatar
    src={src}
    sx={{ bgcolor: "primary.main" }}
    aria-label={ariaLabel}
  >
    {!src && letter}
  </Avatar>
);

export default AuthorAvatar;
