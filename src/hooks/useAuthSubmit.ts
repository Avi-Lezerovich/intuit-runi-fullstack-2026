import * as React from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

interface UseAuthSubmitOptions {
  endpoint: string;
  redirectPath: string;
  onSuccess?: (data: unknown) => void;
}

interface UseAuthSubmitReturn {
  submit: (payload: Record<string, string>) => Promise<unknown>;
}

/**
 * Custom hook for handling auth API submission and navigation.
 * Centralizes fetch logic, error handling, and navigation.
 */
export const useAuthSubmit = ({
  endpoint,
  redirectPath,
  onSuccess,
}: UseAuthSubmitOptions): UseAuthSubmitReturn => {
  const navigate = useNavigate();

  const submit = React.useCallback(
    async (payload: Record<string, string>) => {
      const data = await apiFetch<unknown>(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      onSuccess?.(data);
      navigate(redirectPath, { replace: true });
      return data;
    },
    [endpoint, redirectPath, onSuccess, navigate]
  );

  return { submit };
};
