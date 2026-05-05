import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MuiCard from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { SitemarkIcon } from "../../components/layout/CustomIcons";
import { AUTH_API_URL } from "../../constants/config";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const initialValues = { email: "", password: "" };

export default function SignInForm() {
  const navigate = useNavigate();
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const result: Record<string, string> = {};
    if (!values.email.trim()) {
      result.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email.trim())) {
      result.email = "Please enter a valid email address";
    }
    if (!values.password) {
      result.password = "Password is required";
    } else if (values.password.length < 6) {
      result.password = "Password must be at least 6 characters";
    }
    setErrors(result);
    return Object.keys(result).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const email = values.email.trim();
    const password = values.password;

    setLoading(true);
    setSubmitError(null);

    fetch(`${AUTH_API_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Login failed");
        return res.json();
      })
      .then(() => {
        navigate("/", { replace: true });
      })
      .catch((err) => {
        setSubmitError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card variant="outlined">
      <SitemarkIcon />
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
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            value={values.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
            disabled={loading}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            id="password"
            name="password"
            type="password"
            placeholder="••••••"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            value={values.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
            disabled={loading}
          />
        </FormControl>
        <Button type="submit" fullWidth variant="contained" disabled={loading}>
          Sign in
        </Button>
        {submitError && <Alert severity="error">{submitError}</Alert>}
      </Box>
      <Typography sx={{ textAlign: "center" }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" variant="body2" sx={{ alignSelf: "center" }}>
          Sign up
        </Link>
      </Typography>
    </Card>
  );
}
