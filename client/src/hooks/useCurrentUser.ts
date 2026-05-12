import { useState, useEffect } from "react";
import { getStoredUser } from "../api";
import type { User } from "../types";

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser());

  useEffect(() => {
    const refresh = () => setCurrentUser(getStoredUser());
    window.addEventListener("auth-change", refresh);
    window.addEventListener("storage", refresh); // cross-tab sync
    return () => {
      window.removeEventListener("auth-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return currentUser;
};