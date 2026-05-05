import { Box, Button } from "@mui/material";

const SeePostsButton = ({ onClick, label = "See Posts" }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="contained"
        onClick={onClick}
        sx={{ textTransform: "none", px: 3, py: 1, borderRadius: 2, minWidth: 0 }}
      >
        {label}
      </Button>
    </Box>
  );
}
export default SeePostsButton;