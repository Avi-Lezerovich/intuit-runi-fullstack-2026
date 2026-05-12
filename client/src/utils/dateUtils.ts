/** מחזיר תיאור עברי יחסי לזמן ("ממש עכשיו"/"לפני 5 דקות"/"אתמול"/תאריך מלא). */
export const formatRelative = (iso: string): string => {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const sec = Math.max(0, Math.floor(diffMs / 1000));
  if (sec < 60) return "ממש עכשיו";
  const min = Math.floor(sec / 60);
  if (min < 60) return min === 1 ? "לפני דקה" : `לפני ${min} דקות`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr === 1 ? "לפני שעה" : `לפני ${hr} שעות`;
  const day = Math.floor(hr / 24);
  if (day < 30) return day === 1 ? "אתמול" : `לפני ${day} ימים`;
  return d.toLocaleDateString("he-IL");
};
