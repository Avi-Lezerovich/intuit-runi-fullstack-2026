import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import AppTheme from "../../theme/AppTheme";
import ColorModeSelect from "../../theme/ColorModeSelect";

const AuthContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

interface AuthLayoutProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
}

// Shared chrome for the auth pages: theme provider, baseline, color mode toggle,
// and the gradient-backed full-height container. The forms themselves don't
// know anything about this wrapping.
const AuthLayout = ({ children, disableCustomTheme }: AuthLayoutProps) => {
  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <AuthContainer direction="column" sx={{ justifyContent: "space-between" }}>
        {children}
      </AuthContainer>
    </AppTheme>
  );
}
export default AuthLayout;