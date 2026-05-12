/**
 * Shared validation helpers for the auth forms (login + signup).
 * Pure functions / constants — no React dependencies.
 */

/** RFC-5322-style email check, intentionally loose: rejects whitespace and missing `@`/`.`. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Minimum password length enforced by the signup form. Surfaces in error copy too. */
export const MIN_PASSWORD = 6;

/**
 * Heuristic password strength scorer used to drive the colored progress bar on signup.
 * Additive weights to a 0–100 score:
 *   - length ≥ MIN_PASSWORD: +25
 *   - length ≥ 10:           +20
 *   - any uppercase / Hebrew letter: +15
 *   - any digit:             +20
 *   - any symbol (non-alphanumeric, non-Hebrew): +20
 * Buckets: ≥70 → "strong" (green), ≥40 → "medium" (orange), else → "weak" (red).
 */
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
