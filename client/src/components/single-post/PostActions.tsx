import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import type { VoteSide } from "../../types";

interface PostActionsProps {
  myVote: VoteSide | null;
  voting: boolean;
  canVote: boolean;
  isOwner: boolean;
  isAuthenticated: boolean;
  onVote: (side: VoteSide) => void;
  /** Passed only when the user is the post's owner and the parent wants to offer deletion. */
  onDelete?: () => void;
}

/**
 * Renders the vote buttons (חייב / זכאי) and owner-only delete icon in the Post card footer.
 * Returns a Fragment so the parent's <CardActions> can provide flex layout (vote buttons spaced away from delete).
 * Not rendered at all in preview mode — the orchestrator omits this entirely.
 * @param myVote - Current user's vote ("guilty", "innocent", or null if not voted).
 * @param voting - If true, show loading state on the vote buttons.
 * @param canVote - If false, disable vote buttons (e.g., if user is post owner).
 * @param isOwner - If true, show the delete icon.
 * @param isAuthenticated - If false, disable vote buttons and show login tooltip.
 * @param onVote - Callback when a vote button is clicked.
 * @param onDelete - Callback when delete icon is clicked (only passed if isOwner is true).
 */
const voteTooltip = (isAuthenticated: boolean, isOwner: boolean): string => {
  if (!isAuthenticated) return "התחבר כדי להצביע";
  if (isOwner) return "אינך יכול להצביע על תביעתך";
  return "";
};

export const PostActions = ({
  myVote,
  voting,
  canVote,
  isOwner,
  isAuthenticated,
  onVote,
  onDelete,
}: PostActionsProps) => {
  const tooltip = voteTooltip(isAuthenticated, isOwner);

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Tooltip title={tooltip}>
          <span>
            <Button
              size="small"
              variant={myVote === "guilty" ? "contained" : "outlined"}
              color="error"
              disabled={!canVote || voting}
              onClick={() => onVote("guilty")}
              startIcon={myVote === "guilty" ? <CheckIcon /> : <GavelOutlinedIcon />}
              sx={{ fontWeight: myVote === "guilty" ? 700 : 500 }}
            >
              חייב!
            </Button>
          </span>
        </Tooltip>
        <Tooltip title={tooltip}>
          <span>
            <Button
              size="small"
              variant={myVote === "innocent" ? "contained" : "outlined"}
              color="success"
              disabled={!canVote || voting}
              onClick={() => onVote("innocent")}
              startIcon={
                myVote === "innocent"
                  ? <CheckIcon />
                  : canVote
                  ? <ThumbUpAltIcon />
                  : <ThumbUpAltOutlinedIcon />
              }
              sx={{ fontWeight: myVote === "innocent" ? 700 : 500 }}
            >
              זכאי
            </Button>
          </span>
        </Tooltip>
      </Stack>

      {isOwner && onDelete && (
        <Tooltip title="מחק תביעה">
          <IconButton
            size="small"
            onClick={onDelete}
            sx={{ color: "error.main" }}
            aria-label="מחק תביעה"
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};
