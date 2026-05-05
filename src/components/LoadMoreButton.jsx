import { Box, Button } from "@mui/material";

const LoadMoreButton = ({ onClick, label = "Load More" }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Button
        variant="contained"
        onClick={onClick}
        sx={{ textTransform: "none", px: 4, py: 1, borderRadius: 2 }}
      >
        {label}
      </Button>
    </Box>
  );
}
export default LoadMoreButton;