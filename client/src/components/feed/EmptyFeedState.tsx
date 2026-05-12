import { Link as RouterLink } from "react-router-dom";
import { Paper, Typography, Button } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";

/**
 * Empty-state shown on the Home feed when there are no posts to display
 * (e.g. on first launch, or when a filter returns nothing).
 * CTA adapts to auth state: logged-in users get a "file a lawsuit" button,
 * anonymous visitors get a prompt to sign in first.
 */

interface EmptyFeedStateProps {
  isLoggedIn: boolean;
}

export const EmptyFeedState = ({ isLoggedIn }: EmptyFeedStateProps) => {
  return (
    <Paper
      sx={{
        textAlign: "center",
        py: 6,
        px: 3,
        border: "2px dashed",
        borderColor: "rgba(184, 134, 11, 0.3)",
        backgroundColor: "transparent",
      }}
      elevation={0}
    >
      <Typography sx={{ fontSize: "3rem", mb: 1 }}>⚖️</Typography>
      <Typography variant="h6" sx={{ color: "text.secondary", mb: 0.5 }}>
        שקט בבית המשפט
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        אין תביעות פתוחות. אולי הגיע הזמן שתפתח/י את הראשונה?
      </Typography>
      {isLoggedIn ? (
        <Button component={RouterLink} to="/new-post" variant="contained" color="secondary" startIcon={<GavelIcon />}>
          הגש תביעה ראשונה
        </Button>
      ) : (
        <Button component={RouterLink} to="/login" variant="contained" color="secondary">
          התייצב כדי לתבוע
        </Button>
      )}
    </Paper>
  );
};
