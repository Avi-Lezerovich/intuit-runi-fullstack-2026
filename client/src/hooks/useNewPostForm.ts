import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api";
import { useNotify } from "../components/feedback/Notifications";
import type { Post, User } from "../types";

/** Max characters allowed in the post body — also enforced via maxLength on the textarea. */
export const MAX_BODY = 500;

/** Max number of charges/causes the user can pick from CHARGES_OPTIONS. */
export const MAX_CHARGES = 3;

/**
 * State, validation, charge-toggling, live preview, and submit for the NewPost page.
 * The page splits into a form (left) and a preview panel (right) — both consume this hook's
 * return value, so the preview stays perfectly in sync with the form as the user types.
 */
export const useNewPostForm = (currentUser: User | null) => {
  const navigate = useNavigate();
  const notify = useNotify();

  const [formData, setFormData] = useState({
    defendant: "", location: "", title: "", body: "", damages: "", charges: [] as string[],
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Field-level errors. Only surface for touched fields so we don't yell on first paint.
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

  const handleChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleBlur = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  // Toggle a charge in/out of the selection, enforcing the MAX_CHARGES cap.
  const toggleCharge = (charge: string) => {
    setFormData((prev) => {
      const currentCharges = prev.charges;
      if (currentCharges.includes(charge)) return { ...prev, charges: currentCharges.filter((c) => c !== charge) };
      if (currentCharges.length >= MAX_CHARGES) return prev;
      return { ...prev, charges: [...currentCharges, charge] };
    });
  };

  // Synthetic Post object used ONLY by the preview panel — never sent to the server.
  // id=0 + created_at=now are placeholders so SinglePost can render it like a real post.
  // Memoized on formData + currentUser so the preview reacts to every keystroke without
  // re-allocating an object on every render of the parent.
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
