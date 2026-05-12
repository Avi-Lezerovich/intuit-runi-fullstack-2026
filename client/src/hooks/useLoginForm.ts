import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, saveSession, isLoggedIn } from "../api";
import { useNotify } from "../components/Notifications";
import { EMAIL_RE } from "../utils/validationUtils";

export const useLoginForm = () => {
  const navigate = useNavigate();
  const notify = useNotify();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // חסימת גישה למשתמשים מחוברים
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