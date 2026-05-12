/**
 * Mobile navigation: a right-anchored Drawer containing the route list and auth controls.
 * The same NavItem array used by the desktop nav is rendered here as ListItemButtons
 * so the source of truth (active state, link order) stays in <TopBar />.
 *
 * Opens via the hamburger IconButton in <TopBar />; the drawer auto-closes on route
 * change (effect on location.pathname in the orchestrator).
 */
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import type { User } from "../../../types";
import type { NavItem } from "./TopBarDesktopNav";

interface TopBarMobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
  user: User | null;
  onLogout: () => void;
}

export const TopBarMobileDrawer = ({
  open,
  onClose,
  navItems,
  user,
  onLogout,
}: TopBarMobileDrawerProps) => (
  <Drawer anchor="right" open={open} onClose={onClose}>
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
        {navItems.map((l) => (
          <ListItemButton
            key={l.to}
            component={RouterLink}
            to={l.to}
            selected={l.active}
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
              primaryTypographyProps={{ fontWeight: l.active ? 700 : 400 }}
            />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 1 }} />
        {user ? (
          <>
            <ListItemButton component={RouterLink} to="/new-post">
              <ListItemText
                primary="הגש תביעה"
                primaryTypographyProps={{ color: "secondary.dark", fontWeight: 700 }}
              />
            </ListItemButton>
            <ListItemButton onClick={onLogout}>
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
);
