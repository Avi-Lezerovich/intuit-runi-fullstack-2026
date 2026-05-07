import { Box, Typography } from "@mui/material";

interface ErrorMessageProps {
  title?: string;
  message: string;
}

const ErrorMessage = ({ title = "Something went wrong", message }: ErrorMessageProps) => {
  return (
    <Box
      sx={{
        bgcolor: "error.lighter",
        color: "error.main",
        p: 2,
        borderRadius: 1,
        mb: 3,
      }}
    >
      <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
};

export default ErrorMessage;