import * as React from "react";
import { useNavigate } from "react-router-dom";

interface UseAuthSubmitOptions {
  endpoint: string;
  redirectPath: string;
  onSuccess?: (data: any) => void;
}

interface UseAuthSubmitReturn {
  submit: (payload: Record<string, string>) => Promise<void>;
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
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      onSuccess?.(data);
      navigate(redirectPath, { replace: true });
      return data;
    },
    [endpoint, redirectPath, onSuccess, navigate]
  );

  return { submit };
};
