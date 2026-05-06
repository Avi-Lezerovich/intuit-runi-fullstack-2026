import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import { AUTH_API_URL } from "../../constants/config";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useAuthSubmit } from "../../hooks/useAuthSubmit";
import { emailValidators, passwordValidators } from "../../utils/validators";
import AuthCard from "../../components/ui/AuthCard";
import FormTextField from "../../components/ui/FormTextField";

const initialValues = { email: "", password: "" };

const validationRules = {
  email: emailValidators,
  password: passwordValidators,
};

const SignInForm = () => {
  const { submit } = useAuthSubmit({
    endpoint: `${AUTH_API_URL}/posts`,
    redirectPath: "/",
  });

  const form = useFormValidation({
    initialValues,
    validationRules,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.validate()) return;

    const payload = {
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
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
        <FormTextField
          label="Email"
          name="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          autoFocus
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
          autoComplete="current-password"
          value={form.values.password}
          error={form.errors.password}
          onChange={form.handleChange}
          disabled={form.loading}
        />
        <Button type="submit" fullWidth variant="contained" disabled={form.loading}>
          Sign in
        </Button>
        {form.submitError && <Alert severity="error">{form.submitError}</Alert>}
      </Box>
      <Divider>
        <Typography sx={{ color: "text.secondary" }}>or</Typography>
      </Divider>
      <Typography sx={{ textAlign: "center" }}>
        Don&apos;t have an account?{" "}
        <Link component={RouterLink} to="/signup" variant="body2" sx={{ alignSelf: "center" }}>
          Sign up
        </Link>
      </Typography>
    </AuthCard>
  );
}
export default SignInForm;
