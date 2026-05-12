import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  icon?: ReactNode; // תמיכה באייקון דינאמי
}

export const AuthHeader = ({ title, subtitle, icon }: AuthHeaderProps) => (
  <Box sx={{ textAlign: "center", mb: 3 }}>
    {icon && (
      <Box sx={{ display: 'inline-flex', color: 'secondary.main', '& > svg': { fontSize: 48 } }}>
        {icon}
      </Box>
    )}
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