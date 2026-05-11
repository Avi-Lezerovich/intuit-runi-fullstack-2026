import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Chip,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import VisibilityIcon from "@mui/icons-material/Visibility";

import SinglePost from "../components/SinglePost";
import { useNotify } from "../components/Notifications";
import { createPost, getStoredUser } from "../api";
import { CHARGES_OPTIONS, type Post } from "../types";

const MAX_BODY = 500;
const MAX_CHARGES = 3;

const NewPost = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const currentUser = getStoredUser();

  const [defendant, setDefendant] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [damages, setDamages] = useState("");
  const [charges, setCharges] = useState<string[]>([]);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const errors = {
    defendant: touched.defendant && !defendant.trim() ? "שם הנתבע הוא שדה חובה" : "",
    title: touched.title && !title.trim() ? "כותרת היא שדה חובה" : "",
    body:
      touched.body && !body.trim()
        ? "פירוט הנסיבות הוא שדה חובה"
        : touched.body && body.length > MAX_BODY
        ? `מקסימום ${MAX_BODY} תווים`
        : "",
  };

  const formValid =
    !errors.defendant && !errors.title && !errors.body &&
    defendant.trim() && title.trim() && body.trim() && body.length <= MAX_BODY;

  const toggleCharge = (charge: string) => {
    setCharges((prev) => {
      if (prev.includes(charge)) return prev.filter((c) => c !== charge);
      if (prev.length >= MAX_CHARGES) return prev;
      return [...prev, charge];
    });
  };

  // Live preview — a fake Post object built from the current form state
  const previewPost: Post = useMemo(
    () => ({
      id: 0,
      title: title.trim(),
      body: body.trim(),
      defendant: defendant.trim(),
      location: location.trim() || null,
      charges,
      damages: damages.trim() || null,
      author_id: currentUser?.id ?? 0,
      author_name: currentUser?.name ?? "אתה",
      guilty_votes: 0,
      innocent_votes: 0,
      created_at: new Date().toISOString(),
    }),
    [title, body, defendant, location, charges, damages, currentUser],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ defendant: true, title: true, body: true });
    if (!formValid || !currentUser) return;

    setServerError(null);
    setSubmitting(true);
    try {
      await createPost({
        title: title.trim(),
        body: body.trim(),
        defendant: defendant.trim(),
        location: location.trim() || undefined,
        charges,
        damages: damages.trim() || undefined,
      });
      notify("התביעה הוגשה. בית המשפט פתוח להצבעת מושבעים.", "success");
      navigate(`/user-posts/${currentUser.id}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "שגיאה לא ידועה");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 900, color: "primary.dark" }}
        >
          הגשת תביעה
        </Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.5, fontStyle: "italic" }}>
          מלא את כתב האישום בקפדנות. הקהילה תכריע.
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={3}
        alignItems="flex-start"
      >
        {/* ---- Form ---- */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, flex: 1, width: "100%" }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

            {/* Section A — parties */}
            <Typography variant="h6" sx={{ fontFamily: '"Frank Ruhl Libre", serif', color: "primary.main", mb: 1.5 }}>
              א. פרטי הצדדים
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="שם תובע"
                value={currentUser?.name || ""}
                disabled
                fullWidth
                helperText="ממולא אוטומטית מהמשתמש המחובר"
              />
              <TextField
                label="שם הנתבע *"
                value={defendant}
                onChange={(e) => setDefendant(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, defendant: true }))}
                error={!!errors.defendant}
                helperText={errors.defendant || " "}
                fullWidth
                placeholder="הכלב, השכן, החבר..."
              />
              <TextField
                label="מיקום האירוע (אופציונלי)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
                placeholder="סלון, רחוב הירקון, צומת אחרי קיבוץ יקום..."
              />
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Section B — charges */}
            <Typography variant="h6" sx={{ fontFamily: '"Frank Ruhl Libre", serif', color: "primary.main", mb: 1.5 }}>
              ב. כתב האישום
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="כותרת התביעה *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, title: true }))}
                error={!!errors.title}
                helperText={errors.title || " "}
                fullWidth
                placeholder="הכלב שסירב לזוז מהספה"
              />

              <Box>
                <Typography sx={{ fontWeight: 500, mb: 1, color: "text.primary" }}>
                  עילות (עד {MAX_CHARGES} מתוך {CHARGES_OPTIONS.length})
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                  {CHARGES_OPTIONS.map((c) => {
                    const selected = charges.includes(c);
                    const disabled = !selected && charges.length >= MAX_CHARGES;
                    return (
                      <Chip
                        key={c}
                        label={c}
                        clickable={!disabled}
                        onClick={() => !disabled && toggleCharge(c)}
                        color={selected ? "primary" : "default"}
                        variant={selected ? "filled" : "outlined"}
                        sx={{
                          opacity: disabled ? 0.4 : 1,
                          fontWeight: selected ? 600 : 400,
                        }}
                      />
                    );
                  })}
                </Stack>
              </Box>

              <TextField
                label="פירוט הנסיבות *"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, body: true }))}
                error={!!errors.body}
                helperText={
                  errors.body || (
                    <Box
                      component="span"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: body.length > MAX_BODY * 0.9
                          ? "warning.main"
                          : body.length > MAX_BODY * 0.75
                          ? "secondary.dark"
                          : "text.secondary",
                        fontWeight: body.length > MAX_BODY * 0.9 ? 600 : 400,
                      }}
                    >
                      <span>תאר/י בפירוט — דרמה זוכה במושבעים</span>
                      <span>{body.length} / {MAX_BODY}</span>
                    </Box>
                  )
                }
                fullWidth
                multiline
                rows={6}
                placeholder="תאר/י את הנסיבות בפירוט. ככל שיותר דרמטי — יותר טוב."
                inputProps={{ maxLength: MAX_BODY }}
              />

              <TextField
                label="הפיצוי המבוקש (אופציונלי)"
                value={damages}
                onChange={(e) => setDamages(e.target.value)}
                fullWidth
                placeholder='התנצלות פומבית, פיצוי בפיצה, זכות בלעדית על הספה...'
              />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={18} /> : <GavelIcon />}
                fullWidth
              >
                {submitting ? "מגיש..." : "הגש תביעה לבית המשפט"}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                ביטול
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* ---- Live preview ---- */}
        <Box sx={{ flex: 1, width: "100%", position: { lg: "sticky" }, top: { lg: 80 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <VisibilityIcon sx={{ color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontFamily: '"Frank Ruhl Libre", serif', color: "primary.main" }}>
              תצוגה מקדימה
            </Typography>
          </Box>
          <Box
            sx={{
              border: "2px dashed rgba(184, 134, 11, 0.4)",
              borderRadius: 2,
              p: { xs: 1, sm: 2 },
              backgroundColor: "rgba(184, 134, 11, 0.03)",
            }}
          >
            <SinglePost post={previewPost} preview />
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 1.5, textAlign: "center", fontStyle: "italic" }}>
            כך הקהילה תראה את התביעה. תוכן מתעדכן בזמן אמת.
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};
export default NewPost;
