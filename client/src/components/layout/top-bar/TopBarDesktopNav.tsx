/**
 * Desktop navigation cluster: route buttons (with an active-tab underline) plus
 * auth controls — either a logged-in user's greeting + "submit / logout" pair,
 * or a "login" CTA for anonymous visitors. Rendered when isMobile is false.
 *
 * The shared NavItem type is exported here and reused by <TopBarMobileDrawer />.
 */
import { Link as RouterLink } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import type { User } from "../../../types";

export interface NavItem {
  to: string;
  label: string;
  active: boolean;
}

interface TopBarDesktopNavProps {
  navItems: NavItem[];
  user: User | null;
  onLogout: () => void;
}

export const TopBarDesktopNav = ({ navItems, user, onLogout }: TopBarDesktopNavProps) => (
  <Stack direction="row" spacing={1} alignItems="center">
    {navItems.map((l) => (
      <Button
        key={l.to}
        component={RouterLink}
        to={l.to}
        sx={{
          color: "#FAF6E9",
          position: "relative",
          fontWeight: l.active ? 700 : 400,
          "&:hover": { backgroundColor: "rgba(250, 246, 233, 0.08)" },
          "&::after": l.active
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
    ))}

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
          onClick={onLogout}
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
);
