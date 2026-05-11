import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stack,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  LinearProgress,
} from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { signup as apiSignup, saveSession, isLoggedIn } from "../api";
import { useNotify } from "../components/Notifications";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 6;

function scorePassword(p: string): { score: number; label: string; color: "error" | "warning" | "success" } {
  let s = 0;
  if (p.length >= MIN_PASSWORD) s += 25;
  if (p.length >= 10) s += 20;
  if (/[A-Z]/.test(p) || /[א-ת]/.test(p)) s += 15;
  if (/[0-9]/.test(p)) s += 20;
  if (/[^A-Za-z0-9א-ת]/.test(p)) s += 20;
  if (s >= 70) return { score: Math.min(s, 100), label: "סיסמה חזקה", color: "success" };
  if (s >= 40) return { score: s, label: "סיסמה סבירה", color: "warning" };
  return { score: Math.max(s, 5), label: "סיסמה חלשה", color: "error" };
}

const Signup = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm: false });
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) navigate("/", { replace: true });
  }, [navigate]);

  // All hooks must run on every render — keep this *before* the early return.
  const strength = useMemo(() => scorePassword(password), [password]);

  if (isLoggedIn()) return <Navigate to="/" replace />;

  const errors = {
    name: touched.name && !name.trim() ? "שם הוא שדה חובה" : "",
    email:
      touched.email && !email.trim()
        ? "אימייל הוא שדה חובה"
        : touched.email && !EMAIL_RE.test(email.trim())
        ? "כתובת אימייל אינה תקינה"
        : "",
    password:
      touched.password && password.length < MIN_PASSWORD
        ? `סיסמה חייבת להכיל לפחות ${MIN_PASSWORD} תווים`
        : "",
    confirm:
      touched.confirm && confirm !== password
        ? "הסיסמאות אינן תואמות"
        : "",
  };

  const formValid =
    !errors.name && !errors.email && !errors.password && !errors.confirm &&
    name.trim() && EMAIL_RE.test(email.trim()) && password.length >= MIN_PASSWORD && password === confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (!formValid) return;

    setServerError(null);
    setSubmitting(true);
    try {
      const { token, user } = await apiSignup(name.trim(), email.trim(), password);
      saveSession(token, user);
      notify(`ברוך/ה הבא/ה לבית המשפט, ${user.name}`, "success");
      navigate("/");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "שגיאה לא ידועה");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
      <Paper sx={{ p: { xs: 3, sm: 5 } }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <HowToRegIcon sx={{ fontSize: 48, color: "secondary.main" }} />
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 700, color: "primary.dark", mt: 1 }}
          >
            הצטרף לרשימת התובעים
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
            רישום קצר. תסכולים אינסופיים.
          </Typography>
        </Box>

        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="שם מלא"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              error={!!errors.name}
              helperText={errors.name || " "}
              fullWidth
              autoComplete="name"
              autoFocus
            />
            <TextField
              label="אימייל"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              error={!!errors.email}
              helperText={errors.email || " "}
              fullWidth
              autoComplete="email"
            />
            <Box>
              <TextField
                label="סיסמה"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                error={!!errors.password}
                helperText={errors.password || `לפחות ${MIN_PASSWORD} תווים`}
                fullWidth
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                        aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {password && (
                <Box sx={{ mt: 0.5, px: 0.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={strength.score}
                    color={strength.color}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: `${strength.color}.main`, fontWeight: 600, mt: 0.25, display: "block" }}
                  >
                    {strength.label}
                  </Typography>
                </Box>
              )}
            </Box>
            <TextField
              label="אימות סיסמה"
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
              error={!!errors.confirm}
              helperText={errors.confirm || " "}
              fullWidth
              autoComplete="new-password"
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={18} /> : <HowToRegIcon />}
            >
              {submitting ? "רושם..." : "השבע אמונים"}
            </Button>
          </Stack>
        </Box>

        <Typography sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}>
          כבר רשום?{" "}
          <Link component={RouterLink} to="/login" sx={{ fontWeight: 700, color: "primary.main" }}>
            התייצב באולם
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};
export default Signup;
