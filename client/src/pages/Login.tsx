import { useEffect, useState } from "react";
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
} from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { login as apiLogin, saveSession, isLoggedIn } from "../api";
import { useNotify } from "../components/Notifications";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Bounce already-authenticated users back to the feed
  useEffect(() => {
    if (isLoggedIn()) navigate("/", { replace: true });
  }, [navigate]);

  if (isLoggedIn()) return <Navigate to="/" replace />;

  const errors = {
    email:
      touched.email && !email.trim()
        ? "אימייל הוא שדה חובה"
        : touched.email && !EMAIL_RE.test(email.trim())
        ? "כתובת אימייל אינה תקינה"
        : "",
    password: touched.password && !password ? "סיסמה היא שדה חובה" : "",
  };

  const formValid = !errors.email && !errors.password && email.trim() && password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!formValid) return;

    setServerError(null);
    setSubmitting(true);
    try {
      const { token, user } = await apiLogin(email.trim(), password);
      saveSession(token, user);
      notify(`ברוך/ה שובך, ${user.name}`, "success");
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
          <GavelIcon sx={{ fontSize: 48, color: "secondary.main" }} />
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontFamily: '"Frank Ruhl Libre", serif', fontWeight: 700, color: "primary.dark", mt: 1 }}
          >
            התייצב בפני בית המשפט
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
            הזדהה כדי להגיש תביעות ולהצביע
          </Typography>
        </Box>

        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5}>
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
              autoFocus
            />
            <TextField
              label="סיסמה"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              error={!!errors.password}
              helperText={errors.password || " "}
              fullWidth
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                      size="small"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={18} /> : <GavelIcon />}
            >
              {submitting ? "מתייצב..." : "כנס לאולם"}
            </Button>
          </Stack>
        </Box>

        <Typography sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}>
          עדיין לא תובע?{" "}
          <Link component={RouterLink} to="/signup" sx={{ fontWeight: 700, color: "primary.main" }}>
            הירשם
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};
export default Login;