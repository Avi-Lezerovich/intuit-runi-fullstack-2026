import { Button, Paper, Typography } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import { Link as RouterLink } from "react-router-dom";

/**
 * Empty-state shown on the ProfilePage when the user has no lawsuits.
 * Two variants:
 *   - owner viewing their own profile → CTA to file the first lawsuit
 *   - anyone else viewing this profile → plain "no lawsuits yet" message
 */

interface EmptyPostsStateProps {
  isOwner: boolean;
  userName: string;
}

export const EmptyPostsState = ({ isOwner, userName }: EmptyPostsStateProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        textAlign: "center",
        py: 6,
        px: 3,
        border: "2px dashed",
        borderColor: "rgba(184, 134, 11, 0.3)",
        backgroundColor: "transparent",
      }}
    >
      <Typography sx={{ fontSize: "3rem", mb: 1 }}>📭</Typography>
      {isOwner ? (
        <>
          <Typography variant="h6" sx={{ color: "text.secondary", mb: 0.5 }}>
            עדיין לא הגשת תביעות
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            התסכולים ממתינים. הגיע הזמן לכתוב כתב אישום ראשון.
          </Typography>
          <Button component={RouterLink} to="/new-post" variant="contained" color="secondary" startIcon={<GavelIcon />}>
            הגש תביעה ראשונה
          </Button>
        </>
      ) : (
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          {userName} עדיין לא הגיש/ה תביעות לבית המשפט
        </Typography>
      )}
    </Paper>
  );
};
