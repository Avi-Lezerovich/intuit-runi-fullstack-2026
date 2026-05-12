import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppBar, Box, IconButton, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { clearSession } from "../../../api";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useNotify } from "../../feedback/Notifications";
import { TopBarLogo } from "./TopBarLogo";
import { TopBarDesktopNav } from "./TopBarDesktopNav";
import type { NavItem } from "./TopBarDesktopNav";
import { TopBarMobileDrawer } from "./TopBarMobileDrawer";

const NAV_LINKS: { to: string; label: string }[] = [
  { to: "/", label: "בית" },
  { to: "/users", label: "תובעים" },
  { to: "/about", label: "אודות" },
];

const isActive = (pathname: string, to: string): boolean =>
  to === "/" ? pathname === "/" : pathname.startsWith(to);

/**
 * TopBar — appears on every page.
 * Auth state comes from useCurrentUser (which already listens to "auth-change"
 * and "storage" events for same-tab + cross-tab sync).
 */
const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotify();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const user = useCurrentUser();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close mobile drawer whenever the route changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearSession();
    notify("שחרור באולם בוצע. נתראה בערעור.", "info");
    navigate("/");
  };

  const navItems: NavItem[] = NAV_LINKS.map((l) => ({
    ...l,
    active: isActive(location.pathname, l.to),
  }));

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 2 }}>
          <TopBarLogo />
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
            <TopBarDesktopNav navItems={navItems} user={user} onLogout={handleLogout} />
          )}
        </Toolbar>
      </AppBar>

      <TopBarMobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navItems={navItems}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
};

export default TopBar;
