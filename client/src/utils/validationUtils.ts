export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD = 6;

export const scorePassword = (p: string): { score: number; label: string; color: "error" | "warning" | "success" } => {
  let s = 0;
  if (p.length >= MIN_PASSWORD) s += 25;
  if (p.length >= 10) s += 20;
  if (/[A-Z]/.test(p) || /[א-ת]/.test(p)) s += 15;
  if (/[0-9]/.test(p)) s += 20;
  if (/[^A-Za-z0-9א-ת]/.test(p)) s += 20;
  if (s >= 70) return { score: Math.min(s, 100), label: "סיסמה חזקה", color: "success" };
  if (s >= 40) return { score: s, label: "סיסמה סבירה", color: "warning" };
  return { score: Math.max(s, 5), label: "סיסמה חלשה", color: "error" };
};