import { Link as RouterLink } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";

const BASE = import.meta.env.BASE_URL;

/**
 * Renders the LolSuit brand mark on the left side of the AppBar.
 * Desktop: light-fill horizontal lockup. Narrow (<400px): just the circular icon.
 * Wrapped in a RouterLink to "/" so clicking always returns home.
 */
export const TopBarLogo = () => {
  const theme = useTheme();
  const narrow = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component={RouterLink}
      to="/"
      sx={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        flexShrink: 0,
      }}
      aria-label="LolSuit — לעמוד הבית"
    >
      {narrow ? (
        <Box
          component="img"
          src={`${BASE}lolsuit-icon.svg`}
          alt="LolSuit"
          sx={{ height: 32, width: 32, display: "block" }}
        />
      ) : (
        <Box
          component="img"
          src={`${BASE}lolsuit-lockup-horizontal-light.svg`}
          alt="LolSuit"
          sx={{ height: 42, display: "block" }}
        />
      )}
    </Box>
  );
};
