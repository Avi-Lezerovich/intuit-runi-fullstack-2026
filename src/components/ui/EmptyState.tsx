import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
  title: string;
  description: string;
}

const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        mt: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Box>
  );
};

export default EmptyState;