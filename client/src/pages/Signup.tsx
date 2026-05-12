import { Link as RouterLink, Navigate } from "react-router-dom";
import { Container, Paper, TextField, Button, Typography, Box, Alert, Stack, Link, CircularProgress, InputAdornment, IconButton } from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { isLoggedIn } from "../api";
import { useSignupForm } from "../hooks/useSignupForm";
import { AuthHeader } from "../components/auth/AuthHeader";
import { PasswordStrengthBar } from "../components/auth/PasswordStrengthBar";

const Signup = () => {
  const {
    name, setName, email, setEmail, password, setPassword, confirm, setConfirm,
    showPassword, setShowPassword, setTouched,
    strength, errors, serverError, submitting, handleSubmit, MIN_PASSWORD
  } = useSignupForm();

  if (isLoggedIn()) return <Navigate to="/" replace />;

  /**
   * Signup page — route `/signup`.
   * Thin view: state, validation, and submission live in useSignupForm.
   * Already-logged-in visitors are bounced to "/" to avoid showing the form.
   */
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
      <Paper sx={{ p: { xs: 3, sm: 5 } }}>
        
        <AuthHeader 
          title="הצטרף לרשימת התובעים" 
          subtitle="רישום קצר. תסכולים אינסופיים."
          icon={<HowToRegIcon />}
        />

        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField label="שם מלא" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, name: true }))} error={!!errors.name} helperText={errors.name || " "} fullWidth autoComplete="name" autoFocus />
            <TextField label="אימייל" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))} error={!!errors.email} helperText={errors.email || " "} fullWidth autoComplete="email" />
            
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
                      <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small" aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {password && (
                <PasswordStrengthBar score={strength.score} label={strength.label} color={strength.color} />
              )}
            </Box>

            <TextField label="אימות סיסמה" type={showPassword ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, confirm: true }))} error={!!errors.confirm} helperText={errors.confirm || " "} fullWidth autoComplete="new-password" />
            
            <Button type="submit" variant="contained" color="secondary" size="large" disabled={submitting} startIcon={submitting ? <CircularProgress size={18} /> : <HowToRegIcon />}>
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