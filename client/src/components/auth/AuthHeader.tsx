import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

/**
 * Shared title block for the Login and Signup pages.
 * Renders an optional icon, a serif H1, and a muted subtitle — keeps both auth pages
 * visually consistent without duplicating the markup.
 */

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  /** Optional MUI icon node rendered above the title (Signup uses HowToRegIcon). */
  icon?: ReactNode;
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
