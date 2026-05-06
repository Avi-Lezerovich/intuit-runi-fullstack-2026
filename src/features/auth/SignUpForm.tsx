import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { AUTH_API_URL } from "../../constants/config";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useAuthSubmit } from "../../hooks/useAuthSubmit";
import { 
  nameValidators, 
  emailValidators, 
    passwordValidators
} from "../../utils/validators";
import AuthCard from "../../components/ui/AuthCard";
import FormTextField from "../../components/ui/FormTextField";

const initialValues = { name: "", email: "", password: "", repeatPassword: "" };

const SignUpForm = () => {
  const { submit } = useAuthSubmit({
    endpoint: `${AUTH_API_URL}/users`,
    redirectPath: "/login",
  });

  const form = useFormValidation({
    initialValues,
    // Note: To use passwordMatchValidators accurately, it requires the current password state.
    // However, useFormValidation evaluates validationRules on initial mount if they are static.
    // To cleanly integrate, we will perform repeat password validation inside handleSubmit,
    // but fix the bug by setting the submit error instead of returning silently.
    validationRules: {
      name: nameValidators,
      email: emailValidators,
      password: passwordValidators,
      repeatPassword: [],
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate standard fields first
    if (!form.validate()) return;

    // Custom validation for password match
    if (!form.values.repeatPassword) {
      form.setSubmitError("Please confirm your password");
      return;
    }
    if (form.values.repeatPassword !== form.values.password) {
      form.setSubmitError("Passwords do not match");
      return;
    }

    const payload = {
      name: form.values.name.trim(),
      email: form.values.email.trim(),
      password: form.values.password,
    };

    form.setLoading(true);
    form.setSubmitError(null);

    submit(payload)
      .catch((err) => {
        form.setSubmitError(err.message);
      })
      .finally(() => {
        form.setLoading(false);
      });
  };

  return (
    <AuthCard>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Sign up
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <FormTextField
          label="Full name"
          name="name"
          placeholder="Jon Snow"
          autoComplete="name"
          value={form.values.name}
          error={form.errors.name}
          onChange={form.handleChange}
          disabled={form.loading}
        />
        <FormTextField
          label="Email"
          name="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          value={form.values.email}
          error={form.errors.email}
          onChange={form.handleChange}
          disabled={form.loading}
        />
        <FormTextField
          label="Password"
          name="password"
          type="password"
          placeholder="••••••"
          autoComplete="new-password"
          value={form.values.password}
          error={form.errors.password}
          onChange={form.handleChange}
          disabled={form.loading}
        />
        <FormTextField
          label="Repeat Password"
          name="repeatPassword"
          type="password"
          placeholder="••••••"
          autoComplete="new-password"
          value={form.values.repeatPassword}
          error={form.errors.repeatPassword}
          onChange={form.handleChange}
          disabled={form.loading}
        />
        <Button type="submit" fullWidth variant="contained" disabled={form.loading}>
          Sign up
        </Button>
        {form.submitError && <Alert severity="error">{form.submitError}</Alert>}
      </Box>
      <Divider>
        <Typography sx={{ color: "text.secondary" }}>or</Typography>
      </Divider>
      <Typography sx={{ textAlign: "center" }}>
        Already have an account?{" "}
        <Link component={RouterLink} to="/login" variant="body2" sx={{ alignSelf: "center" }}>
          Sign in
        </Link>
      </Typography>
    </AuthCard>
  );
} 
export default SignUpForm;
