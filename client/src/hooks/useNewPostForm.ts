import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api";
import { useNotify } from "../components/Notifications";
import type { Post, User } from "../types";

export const MAX_BODY = 500;
export const MAX_CHARGES = 3;

export const useNewPostForm = (currentUser: User | null) => {
  const navigate = useNavigate();
  const notify = useNotify();

  const [formData, setFormData] = useState({
    defendant: "", location: "", title: "", body: "", damages: "", charges: [] as string[],
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // ולידציה
  const errors = {
    defendant: touched.defendant && !formData.defendant.trim() ? "שם הנתבע הוא שדה חובה" : "",
    title: touched.title && !formData.title.trim() ? "כותרת היא שדה חובה" : "",
    body: touched.body && !formData.body.trim()
        ? "פירוט הנסיבות הוא שדה חובה"
        : touched.body && formData.body.length > MAX_BODY
        ? `מקסימום ${MAX_BODY} תווים` : "",
  };

  const formValid = !errors.defendant && !errors.title && !errors.body &&
    formData.defendant.trim() && formData.title.trim() && formData.body.trim() && formData.body.length <= MAX_BODY;

  // עדכון שדות פשוט
  const handleChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleBlur = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  // לוגיקה ייעודית לבחירת עילות
  const toggleCharge = (charge: string) => {
    setFormData((prev) => {
      const currentCharges = prev.charges;
      if (currentCharges.includes(charge)) return { ...prev, charges: currentCharges.filter((c) => c !== charge) };
      if (currentCharges.length >= MAX_CHARGES) return prev;
      return { ...prev, charges: [...currentCharges, charge] };
    });
  };

  // יצירת פוסט דמה עבור התצוגה המקדימה
  const previewPost: Post = useMemo(() => ({
    id: 0,
    title: formData.title.trim(),
    body: formData.body.trim(),
    defendant: formData.defendant.trim(),
    location: formData.location.trim() || null,
    charges: formData.charges,
    damages: formData.damages.trim() || null,
    author_id: currentUser?.id ?? 0,
    author_name: currentUser?.name ?? "אתה",
    guilty_votes: 0, innocent_votes: 0,
    created_at: new Date().toISOString(),
  }), [formData, currentUser]);

  // שליחת הטופס לשרת
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ defendant: true, title: true, body: true });
    if (!formValid || !currentUser) return;

    setServerError(null);
    setSubmitting(true);
    try {
      await createPost({
        title: formData.title.trim(), body: formData.body.trim(),
        defendant: formData.defendant.trim(), location: formData.location.trim() || undefined,
        charges: formData.charges, damages: formData.damages.trim() || undefined,
      });
      notify("התביעה הוגשה. בית המשפט פתוח להצבעת מושבעים.", "success");
      navigate(`/user-posts/${currentUser.id}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "שגיאה לא ידועה");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData, errors, touched, submitting, serverError,
    handleChange, handleBlur, toggleCharge, handleSubmit, previewPost, navigate
  };
};