import { createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";

/**
 * Legal-themed palette: deep navy + parchment + brass-gold accent.
 * Two display fonts:
 *   - Frank Ruhl Libre — serif, used for titles and "kvetch" headlines.
 *   - Heebo — clean sans, used for body and UI.
 */

const themeOptions: ThemeOptions = {
  direction: "rtl",
  palette: {
    mode: "light",
    primary: {
      main: "#1A2E4F",   // deep court navy
      dark: "#0F1D33",
      light: "#3C5278",
      contrastText: "#FAF6E9",
    },
    secondary: {
      main: "#B8860B",   // brass gold (the gavel)
      dark: "#8B6508",
      light: "#D4A82A",
      contrastText: "#1A2E4F",
    },
    error: {
      main: "#9B2C2C",   // courtroom red, restrained
    },
    success: {
      main: "#2F6B3E",
    },
    warning: {
      main: "#C77700",
    },
    background: {
      default: "#FAF6E9",  // parchment
      paper: "#FFFDF5",
    },
    text: {
      primary: "#1A2E4F",
      secondary: "#5A4F3C",
    },
    divider: "rgba(26, 46, 79, 0.15)",
  },
  typography: {
    fontFamily: '"Heebo", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 700 },
    h4: { fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 700 },
    h5: { fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 500 },
    h6: { fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 500 },
    button: { fontWeight: 500, textTransform: "none" },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Safety net: nothing should ever cause horizontal scroll. If a child
        // overflows, we'd rather clip than break the layout.
        html: { overflowX: "hidden" },
        body: {
          overflowX: "hidden",
          backgroundColor: "#FAF6E9",
          // Subtle paper-grain background using two layered radial gradients
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(184, 134, 11, 0.04), transparent 50%), radial-gradient(circle at 80% 70%, rgba(26, 46, 79, 0.04), transparent 50%)",
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: "#1A2E4F",
          borderBottom: "3px solid #B8860B",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 4 },
        containedSecondary: {
          color: "#1A2E4F",
          fontWeight: 700,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(26, 46, 79, 0.12)",
          boxShadow: "0 1px 3px rgba(26, 46, 79, 0.06), 0 4px 12px rgba(26, 46, 79, 0.04)",
          transition: "box-shadow 180ms ease, transform 180ms ease",
          "@media (hover: hover)": {
            "&:hover": {
              boxShadow:
                "0 2px 6px rgba(26, 46, 79, 0.1), 0 8px 24px rgba(26, 46, 79, 0.08)",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: "1rem",
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
