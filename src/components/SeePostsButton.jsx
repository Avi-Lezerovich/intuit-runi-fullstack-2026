import { Button } from "@mui/material";

const SeePostsButton = ({ onClick, label = "See Posts" }) => (
  <Button
    variant="contained"
    size="small"
    disableElevation
    onClick={onClick}
    sx={{
      textTransform: "none",
      borderRadius: 1.5,
      fontSize: 13,
      fontWeight: 500,
      px: 1.75,
      py: 0.75,
      bgcolor: "primary.main",
      "&:hover": { bgcolor: "primary.dark", opacity: 0.9 },
    }}
  >
    {label}
  </Button>
);

export default SeePostsButton;