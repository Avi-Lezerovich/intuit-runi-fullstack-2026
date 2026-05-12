// נתיב: client/src/pages/Login.tsx
import { Link as RouterLink, Navigate } from "react-router-dom";
import { Container, Paper, TextField, Button, Typography, Box, Alert, Stack, Link, CircularProgress, InputAdornment, IconButton } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { isLoggedIn } from "../api";
import { useLoginForm } from "../hooks/useLoginForm";
import { AuthHeader } from "../components/auth/AuthHeader";

const Login = () => {
  const {
    email, setEmail, password, setPassword, showPassword, setShowPassword,
    setTouched, errors, serverError, submitting, handleSubmit
  } = useLoginForm();

  // מניעת רינדור אם המשתמש כבר מחובר
  if (isLoggedIn()) return <Navigate to="/" replace />;

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
      <Paper sx={{ p: { xs: 3, sm: 5 } }}>
        
        {/* שימוש בקומפוננטה המשותפת שיצרנו */}
        <AuthHeader 
          title="התייצב בפני בית המשפט" 
          subtitle="הזדהה כדי להגיש תביעות ולהצביע" 
        />

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
                    <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"} size="small">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" color="secondary" size="large" disabled={submitting} startIcon={submitting ? <CircularProgress size={18} /> : <GavelIcon />}>
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