/**
 * Brand mark on the left side of the AppBar: gavel icon + "Suit for Fun" wordmark.
 * Wrapped in a RouterLink to "/" so clicking the logo always returns to the feed.
 */
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";

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
