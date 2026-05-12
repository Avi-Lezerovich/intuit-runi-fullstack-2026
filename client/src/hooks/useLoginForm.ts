/** Form state, validation, and submit for the Login page. */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, saveSession, isLoggedIn } from "../api";
import { useNotify } from "../components/feedback/Notifications";
import { EMAIL_RE } from "../utils/validationUtils";

/**
 * State + validation + submit handler for the Login page.
 * Returns everything the <Login /> view needs — the page stays a thin renderer.
 *
 * Validation is "touched-based": errors only show after the user has blurred a field,
 * to avoid yelling at them before they've had a chance to type. On submit we mark all
 * touched so missing fields light up at once.
 */
export const useLoginForm = () => {
  const navigate = useNavigate();
  const notify = useNotify();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If the user is already logged in, bounce them to the feed —
  // landing on /login while authenticated is almost always a mistake.
  useEffect(() => {
    if (isLoggedIn()) navigate("/", { replace: true });
  }, [navigate]);

  const errors = {
    email: touched.email && !email.trim()
        ? "אימייל הוא שדה חובה"
        : touched.email && !EMAIL_RE.test(email.trim())
        ? "כתובת אימייל אינה תקינה"
        : "",
    password: touched.password && !password ? "סיסמה היא שדה חובה" : "",
  };

  const formValid = !errors.email && !errors.password && email.trim() && password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mark everything touched so missing-field errors surface at once on submit.
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

  return {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    touched, setTouched,
    errors, serverError, submitting,
    handleSubmit
  };
};
