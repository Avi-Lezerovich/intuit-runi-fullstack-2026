export const getInitials = (name: string): string => {
  if (!name) return "";
  return name.split(/\s+/).map((p) => p[0]).filter(Boolean).slice(0, 2).join("");
};