/** Form state, validation, password-strength meter, and submit for the Signup page. */
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { signup as apiSignup, saveSession, isLoggedIn } from "../api";
import { useNotify } from "../components/feedback/Notifications";
import { EMAIL_RE, MIN_PASSWORD, scorePassword } from "../utils/validationUtils";

/**
 * State + validation + submit handler for the Signup page.
 * Same touched-based validation pattern as useLoginForm, plus a memoized password-strength
 * score that drives the colored progress bar in the UI.
 */
export const useSignupForm = () => {
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

  // Already authenticated? Skip signup and go home.
  useEffect(() => {
    if (isLoggedIn()) navigate("/", { replace: true });
  }, [navigate]);

  // Memoized so the strength bar doesn't recompute on unrelated re-renders.
  const strength = useMemo(() => scorePassword(password), [password]);

  const errors = {
    name: touched.name && !name.trim() ? "שם הוא שדה חובה" : "",
    email: touched.email && !email.trim()
        ? "אימייל הוא שדה חובה"
        : touched.email && !EMAIL_RE.test(email.trim())
        ? "כתובת אימייל אינה תקינה" : "",
    password: touched.password && password.length < MIN_PASSWORD
        ? `סיסמה חייבת להכיל לפחות ${MIN_PASSWORD} תווים` : "",
    confirm: touched.confirm && confirm !== password
        ? "הסיסמאות אינן תואמות" : "",
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

  return {
    name, setName, email, setEmail, password, setPassword, confirm, setConfirm,
    showPassword, setShowPassword, touched, setTouched,
    strength, errors, serverError, submitting, handleSubmit, MIN_PASSWORD
  };
};
