import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Alert, Snackbar, Slide } from "@mui/material";
import type { AlertColor, SnackbarOrigin } from "@mui/material";

/**
 * App-wide toast/snackbar layer.
 * Replaces ad-hoc alert() calls with themed feedback.
 *
 * Usage:
 *   const notify = useNotify();
 *   notify("התביעה נמחקה", "success");
 */

interface NotifyOptions {
  severity?: AlertColor;
  durationMs?: number;
}

type NotifyFn = (message: string, severityOrOpts?: AlertColor | NotifyOptions) => void;

const NotifyContext = createContext<NotifyFn | null>(null);

interface Toast {
  key: number;
  message: string;
  severity: AlertColor;
  durationMs: number;
}

const ANCHOR: SnackbarOrigin = { vertical: "bottom", horizontal: "center" };

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);

  const notify = useCallback<NotifyFn>((message, opts) => {
    const severity: AlertColor =
      typeof opts === "string" ? opts : opts?.severity ?? "info";
    const durationMs = typeof opts === "object" ? opts?.durationMs ?? 4000 : 4000;
    setToast({ key: Date.now(), message, severity, durationMs });
  }, []);

  const value = useMemo(() => notify, [notify]);

  return (
    <NotifyContext.Provider value={value}>
      {children}
      <Snackbar
        key={toast?.key}
        open={!!toast}
        autoHideDuration={toast?.durationMs ?? 4000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setToast(null);
        }}
        anchorOrigin={ANCHOR}
        TransitionComponent={Slide}
      >
        {toast ? (
          <Alert
            severity={toast.severity}
            variant="filled"
            onClose={() => setToast(null)}
            sx={{ minWidth: 280, fontWeight: 500, boxShadow: 3 }}
          >
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </NotifyContext.Provider>
  );
};

export const useNotify = () => {
  const fn = useContext(NotifyContext);
  if (!fn) throw new Error("useNotify must be used inside <NotificationsProvider>");
  return fn;
};
