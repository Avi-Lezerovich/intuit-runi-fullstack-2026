import { Link as RouterLink } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";

/**
 * Renders the brand mark: gavel icon + "Suit for Fun" wordmark on the left side of the AppBar.
 * Wrapped in a RouterLink to "/" so clicking always returns to the home feed.
 * No props; renders as a fixed, non-interactive semantic element except for the link.
 */
export const TopBarLogo = () => (
  <Box
    component={RouterLink}
    to="/"
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      color: "#FAF6E9",
      textDecoration: "none",
      flexShrink: 0,
    }}
  >
    <GavelIcon sx={{ color: "secondary.main", fontSize: 28 }} />
    <Typography
      variant="h5"
      component="span"
      sx={{
        fontFamily: '"Frank Ruhl Libre", serif',
        fontWeight: 700,
        color: "#FAF6E9",
        letterSpacing: "-0.01em",
      }}
    >
      Suit for Fun
    </Typography>
  </Box>
);
