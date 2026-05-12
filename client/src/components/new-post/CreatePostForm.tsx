import { Paper, Box, Stack, TextField, Button, Typography, Chip, Alert, Divider, CircularProgress } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import { CHARGES_OPTIONS } from "../../types";
import { MAX_BODY, MAX_CHARGES, useNewPostForm } from "../../hooks/useNewPostForm";

/**
 * Left-side panel of the NewPost route: the controlled form for filing a new lawsuit.
 * All form state, validation, and submission live inside the useNewPostForm hook;
 * this component is pure presentation — it consumes the hook's return value via `hookData`.
 * Mirrors the live preview on the right (<PostPreviewPanel />).
 */

interface CreatePostFormProps {
  /** Full return value of the useNewPostForm hook — keeps the form-state contract in one place. */
  hookData: ReturnType<typeof useNewPostForm>;
  authorName: string;
}

export const CreatePostForm = ({ hookData, authorName }: CreatePostFormProps) => {
  const { formData, errors, submitting, serverError, handleChange, handleBlur, toggleCharge, handleSubmit, navigate } = hookData;

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, flex: 1, width: "100%" }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

        <Typography variant="h6" sx={{ fontFamily: '"Frank Ruhl Libre", serif', color: "primary.main", mb: 1.5 }}>
          א. פרטי הצדדים
        </Typography>
        <Stack spacing={2}>
          <TextField label="שם תובע" value={authorName} disabled fullWidth helperText="ממולא אוטומטית מהמשתמש המחובר" />
          <TextField label="שם הנתבע *" value={formData.defendant} onChange={(e) => handleChange("defendant", e.target.value)} onBlur={() => handleBlur("defendant")} error={!!errors.defendant} helperText={errors.defendant || " "} fullWidth placeholder="הכלב, השכן, החבר..." />
          <TextField label="מיקום האירוע (אופציונלי)" value={formData.location} onChange={(e) => handleChange("location", e.target.value)} fullWidth placeholder="סלון, רחוב הירקון, צומת אחרי קיבוץ יקום..." />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ fontFamily: '"Frank Ruhl Libre", serif', color: "primary.main", mb: 1.5 }}>
          ב. כתב האישום
        </Typography>
        <Stack spacing={2}>
          <TextField label="כותרת התביעה *" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} onBlur={() => handleBlur("title")} error={!!errors.title} helperText={errors.title || " "} fullWidth placeholder="הכלב שסירב לזוז מהספה" />

          <Box>
            <Typography sx={{ fontWeight: 500, mb: 1, color: "text.primary" }}>
              עילות (עד {MAX_CHARGES} מתוך {CHARGES_OPTIONS.length})
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              {CHARGES_OPTIONS.map((c) => {
                const selected = formData.charges.includes(c);
                const disabled = !selected && formData.charges.length >= MAX_CHARGES;
                return (
                  <Chip key={c} label={c} clickable={!disabled} onClick={() => !disabled && toggleCharge(c)} color={selected ? "primary" : "default"} variant={selected ? "filled" : "outlined"} sx={{ opacity: disabled ? 0.4 : 1, fontWeight: selected ? 600 : 400 }} />
                );
              })}
            </Stack>
          </Box>

          <TextField label="פירוט הנסיבות *" value={formData.body} onChange={(e) => handleChange("body", e.target.value)} onBlur={() => handleBlur("body")} error={!!errors.body} fullWidth multiline rows={6} placeholder="תאר/י את הנסיבות בפירוט..." inputProps={{ maxLength: MAX_BODY }}
            helperText={errors.body || (
              <Box component="span" sx={{ display: "flex", justifyContent: "space-between", color: formData.body.length > MAX_BODY * 0.9 ? "warning.main" : "text.secondary" }}>
                <span>תאר/י בפירוט — דרמה זוכה במושבעים</span>
                <span>{formData.body.length} / {MAX_BODY}</span>
              </Box>
            )}
          />

          <TextField label="הפיצוי המבוקש (אופציונלי)" value={formData.damages} onChange={(e) => handleChange("damages", e.target.value)} fullWidth placeholder="התנצלות פומבית..." />
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button type="submit" variant="contained" color="secondary" size="large" disabled={submitting} startIcon={submitting ? <CircularProgress size={18} /> : <GavelIcon />} fullWidth>
            {submitting ? "מגיש..." : "הגש תביעה"}
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate(-1)} disabled={submitting}>ביטול</Button>
        </Stack>
      </Box>
    </Paper>
  );
};
