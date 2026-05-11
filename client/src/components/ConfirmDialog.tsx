import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";

/**
 * Themed confirmation dialog — replacement for browser confirm().
 * Used for destructive actions (delete a lawsuit).
 */
interface Props {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title = "האם הינך בטוח/ה?",
  message,
  confirmLabel = "אישור",
  cancelLabel = "ביטול",
  destructive = false,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderTop: "4px solid",
          borderTopColor: destructive ? "error.main" : "secondary.main",
          minWidth: { xs: "auto", sm: 380 },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: '"Frank Ruhl Libre", serif',
          fontWeight: 700,
          color: "primary.dark",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <GavelIcon sx={{ color: destructive ? "error.main" : "secondary.main" }} />
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "text.primary", lineHeight: 1.7 }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} color="inherit">
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={destructive ? "error" : "primary"}
          autoFocus
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;
