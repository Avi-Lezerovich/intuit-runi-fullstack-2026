import { Box, CircularProgress } from "@mui/material";

interface PageLoaderProps {
  size?: number;
  minHeight?: number | string;
  py?: number;
}

const PageLoader = ({ size = 40, minHeight, py = 10 }: PageLoaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py,
        minHeight,
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default PageLoader;