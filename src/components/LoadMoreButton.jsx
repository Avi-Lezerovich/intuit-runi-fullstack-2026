import { Box, Button } from "@mui/material";

const LoadMoreButton = ({ onClick, label = "Load More" }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <Button
        variant="outlined"
        onClick={onClick}
        sx={{
          textTransform: "none",
          borderRadius: 2,
          px: 4,
          fontWeight: 500,
          color: "text.secondary",
          borderColor: "divider",
          "&:hover": { bgcolor: "action.hover", borderColor: "text.disabled" },
        }}
      >
        {label}
      </Button>
    </Box>
  );
};

export default LoadMoreButton;