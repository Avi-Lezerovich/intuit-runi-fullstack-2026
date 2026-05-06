import { Avatar } from "@mui/material";

const AuthorAvatar = ({ src, letter, ariaLabel = "author" }) => (
  <Avatar
    src={src}
    sx={{ bgcolor: "primary.main" }}
    aria-label={ariaLabel}
  >
    {!src && letter}
  </Avatar>
);

export default AuthorAvatar;
