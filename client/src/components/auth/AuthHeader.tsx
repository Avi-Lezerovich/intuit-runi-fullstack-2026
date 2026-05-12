import { Box, Typography } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => (
  <Box sx={{ textAlign: "center", mb: 3 }}>
    <GavelIcon sx={{ fontSize: 48, color: "secondary.main" }} />
    <Typography
      variant="h4"
      component="h1"
      sx={{ fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 700, color: "primary.dark", mt: 1 }}
    >
      {title}
    </Typography>
    <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
      {subtitle}
    </Typography>
  </Box>
);