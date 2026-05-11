import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GavelIcon from "@mui/icons-material/Gavel";

import { clearSession, getStoredUser } from "../api";
import { useNotify } from "./Notifications";
import type { User } from "../types";

/**
 * TopBar — appears on every page.
 * Reads auth state from localStorage and re-renders on the "auth-change" event.
 */
const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotify();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Re-read user when auth changes (login, signup, logout — all dispatch this event)
  useEffect(() => {
    const refresh = () => setUser(getStoredUser());
    window.addEventListener("auth-change", refresh);
    window.addEventListener("storage", refresh); // cross-tab sync
    return () => {
      window.removeEventListener("auth-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // Close mobile drawer whenever the route changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearSession();
    notify("שחרור באולם בוצע. נתראה בערעור.", "info");
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "בית" },
    { to: "/users", label: "תובעים" },
    { to: "/about", label: "אודות" },
  ];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 2 }}>
          {/* Logo (always on the right in RTL) */}
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

          <Box sx={{ flex: 1 }} />

          {isMobile ? (
            <IconButton
              edge="end"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: "#FAF6E9" }}
              aria-label="פתח תפריט"
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
              {navLinks.map((l) => {
                const active = isActive(l.to);
                return (
                  <Button
                    key={l.to}
                    component={RouterLink}
                    to={l.to}
                    sx={{
                      color: "#FAF6E9",
                      position: "relative",
                      fontWeight: active ? 700 : 400,
                      "&:hover": { backgroundColor: "rgba(250, 246, 233, 0.08)" },
                      "&::after": active
                        ? {
                            content: '""',
                            position: "absolute",
                            insetInline: 12,
                            bottom: 6,
                            height: 2,
                            backgroundColor: "secondary.main",
                            borderRadius: 1,
                          }
                        : undefined,
                    }}
                  >
                    {l.label}
                  </Button>
                );
              })}

              {user ? (
                <>
                  <Button
                    component={RouterLink}
                    to="/new-post"
                    variant="contained"
                    color="secondary"
                    startIcon={<GavelIcon />}
                  >
                    הגש תביעה
                  </Button>
                  <Typography
                    sx={{
                      color: "#FAF6E9",
                      mx: 1,
                      fontWeight: 500,
                      maxWidth: 180,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={user.name}
                  >
                    שלום, {user.name}
                  </Typography>
                  <Button
                    onClick={handleLogout}
                    sx={{
                      color: "#FAF6E9",
                      border: "1px solid rgba(250, 246, 233, 0.3)",
                      "&:hover": { backgroundColor: "rgba(250, 246, 233, 0.08)" },
                    }}
                  >
                    שחרור באולם
                  </Button>
                </>
              ) : (
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  color="secondary"
                >
                  התייצב
                </Button>
              )}
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile drawer — anchored to the right (RTL start side) */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }} role="navigation">
          <Typography
            variant="h6"
            sx={{ px: 2, fontFamily: '"Frank Ruhl Libre", serif', color: "primary.main" }}
          >
            ⚖️ Suit for Fun
          </Typography>
          {user && (
            <Typography
              variant="caption"
              sx={{
                px: 2,
                color: "text.secondary",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.name}
            </Typography>
          )}
          <Divider sx={{ my: 1 }} />
          <List>
            {navLinks.map((l) => {
              const active = isActive(l.to);
              return (
                <ListItemButton
                  key={l.to}
                  component={RouterLink}
                  to={l.to}
                  selected={active}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "rgba(184, 134, 11, 0.12)",
                      borderInlineEnd: "3px solid",
                      borderInlineEndColor: "secondary.main",
                    },
                  }}
                >
                  <ListItemText
                    primary={l.label}
                    primaryTypographyProps={{ fontWeight: active ? 700 : 400 }}
                  />
                </ListItemButton>
              );
            })}
            <Divider sx={{ my: 1 }} />
            {user ? (
              <>
                <ListItemButton component={RouterLink} to="/new-post">
                  <ListItemText
                    primary="הגש תביעה"
                    primaryTypographyProps={{ color: "secondary.dark", fontWeight: 700 }}
                  />
                </ListItemButton>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="שחרור באולם" />
                </ListItemButton>
              </>
            ) : (
              <ListItemButton component={RouterLink} to="/login">
                <ListItemText
                  primary="התייצב"
                  primaryTypographyProps={{ color: "secondary.dark", fontWeight: 700 }}
                />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};
export default TopBar;
