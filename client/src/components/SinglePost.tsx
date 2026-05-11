import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Collapse,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckIcon from "@mui/icons-material/Check";

import type { Post, VoteSide } from "../types";
import { votePost, getMyVote, setMyVote } from "../api";

interface Props {
  post: Post;
  currentUserId?: number;
  onDelete?: (id: number) => void;
  /** Render as a static preview (no actions, no truncation) — used in NewPost. */
  preview?: boolean;
  /** Notify parent when vote tallies change (so the parent can update its list). */
  onVoteChange?: (postId: number, guilty: number, innocent: number) => void;
}

const formatRelative = (iso: string): string => {
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

const SIDE_LABEL: Record<VoteSide, string> = { guilty: "חייב", innocent: "זכאי" };

const initials = (name: string): string => {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
};

const SinglePost = ({
  post,
  currentUserId,
  onDelete,
  preview = false,
  onVoteChange,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [voting, setVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  // Hydrate from localStorage; updated on a successful vote.
  const [myVote, setMyVoteState] = useState<VoteSide | null>(() =>
    preview ? null : getMyVote(post.id),
  );

  // Vote tallies are owned by the parent; deriving from props avoids stale
  // state if the parent passes refreshed counters (e.g., after a feed reload).
  const guiltyVotes = post.guilty_votes;
  const innocentVotes = post.innocent_votes;
  const totalVotes = guiltyVotes + innocentVotes;
  const guiltyPct = totalVotes ? Math.round((guiltyVotes / totalVotes) * 100) : 0;
  const innocentPct = totalVotes ? 100 - guiltyPct : 0;

  const isOwner = !!currentUserId && currentUserId === post.author_id;
  const canVote = !!currentUserId && !isOwner && !preview;
  const isHot = totalVotes >= 200;

  const bodyIsLong = post.body.length > 180;

  const handleVote = async (side: VoteSide) => {
    if (!canVote || voting) return;
    setVoting(true);
    setVoteError(null);
    try {
      const result = await votePost(post.id, side);
      setMyVote(post.id, side);
      setMyVoteState(side);
      onVoteChange?.(post.id, result.guilty_votes, result.innocent_votes);
    } catch (err) {
      setVoteError(err instanceof Error ? err.message : "שגיאת הצבעה");
    } finally {
      setVoting(false);
    }
  };

  return (
    <Card sx={{ overflow: "visible", position: "relative" }}>
      {isHot && !preview && (
        <Chip
          icon={<LocalFireDepartmentIcon sx={{ fontSize: "1rem !important", color: "primary.main !important" }} />}
          label="חם"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            insetInlineEnd: 12,
            backgroundColor: "secondary.main",
            color: "primary.main",
            fontWeight: 700,
            zIndex: 1,
            "& .MuiChip-icon": { marginInlineStart: 0.5, marginInlineEnd: -0.25 },
          }}
        />
      )}

      <CardContent sx={{ pb: 1 }}>
        {/* Author + time */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <Avatar
            sx={{ bgcolor: "primary.main", color: "background.default", width: 40, height: 40, fontWeight: 700 }}
          >
            {initials(post.author_name)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              component={preview ? "span" : RouterLink}
              to={preview ? undefined : `/user-posts/${post.author_id}`}
              sx={{
                fontWeight: 600,
                color: "primary.main",
                textDecoration: "none",
                "&:hover": preview ? {} : { textDecoration: "underline" },
                fontSize: "0.95rem",
              }}
            >
              {post.author_name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
              {formatRelative(post.created_at)}
            </Typography>
          </Box>
        </Stack>

        {/* Title */}
        <Typography
          variant="h5"
          component="h3"
          sx={{
            fontFamily: '"Frank Ruhl Libre", serif',
            fontWeight: 700,
            mb: 1.5,
            lineHeight: 1.3,
            color: "primary.dark",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {post.title || (preview ? "כותרת התביעה תופיע כאן" : "")}
        </Typography>

        {/* Plaintiff vs Defendant */}
        <Box
          sx={{
            backgroundColor: "rgba(184, 134, 11, 0.08)",
            border: "1px solid rgba(184, 134, 11, 0.25)",
            borderRadius: 1,
            px: 2,
            py: 1.25,
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1, sm: 2 },
            flexWrap: "wrap",
            fontFamily: '"Frank Ruhl Libre", serif',
          }}
        >
          <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>תובע:</Typography>
          <Typography sx={{ fontWeight: 700, color: "primary.main" }}>{post.author_name}</Typography>
          <Typography sx={{ color: "secondary.dark", fontStyle: "italic", fontWeight: 700, fontSize: "1.1rem" }}>
            נ׳
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>נתבע:</Typography>
          <Typography sx={{ fontWeight: 700, color: "error.main" }}>
            {post.defendant || (preview ? "—" : "")}
          </Typography>
        </Box>

        {/* Charges */}
        {post.charges && post.charges.length > 0 && (
          <Stack direction="row" spacing={0.75} sx={{ mb: 1.5, flexWrap: "wrap", gap: 0.75 }}>
            {post.charges.map((c) => (
              <Chip
                key={c}
                label={c}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: "primary.main",
                  color: "primary.main",
                  backgroundColor: "rgba(26, 46, 79, 0.04)",
                }}
              />
            ))}
          </Stack>
        )}

        {/* Body */}
        <Box sx={{ position: "relative" }}>
          <Collapse in={preview || expanded || !bodyIsLong} collapsedSize={bodyIsLong ? 72 : 0}>
            <Typography
              sx={{
                whiteSpace: "pre-wrap",
                color: "text.primary",
                lineHeight: 1.7,
                fontSize: "0.97rem",
                "&::before": {
                  content: '"\\201E"',
                  fontSize: "2rem",
                  color: "secondary.main",
                  fontFamily: '"Frank Ruhl Libre", serif',
                  marginInlineEnd: 1,
                  lineHeight: 0.8,
                  verticalAlign: "-0.4em",
                },
                "&::after": {
                  content: '"\\201D"',
                  fontSize: "2rem",
                  color: "secondary.main",
                  fontFamily: '"Frank Ruhl Libre", serif',
                  marginInlineStart: 0.5,
                  lineHeight: 0.8,
                  verticalAlign: "-0.4em",
                },
              }}
            >
              {post.body || (preview ? "פירוט הנסיבות יופיע כאן בזמן אמת בזמן ההקלדה." : "")}
            </Typography>
          </Collapse>
          {bodyIsLong && !preview && (
            <Button
              size="small"
              onClick={() => setExpanded((v) => !v)}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ mt: 0.5, color: "primary.main" }}
            >
              {expanded ? "סגור" : "קרא עוד"}
            </Button>
          )}
        </Box>

        {/* Location & damages — promoted from a cramped caption to a small labeled section */}
        {(post.location || post.damages) && (
          <Stack
            spacing={0.75}
            sx={{
              mt: 2,
              pt: 1.5,
              borderTop: "1px dashed",
              borderColor: "divider",
            }}
          >
            {post.location && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                <LocationOnOutlinedIcon sx={{ fontSize: "1.1rem", color: "secondary.dark" }} />
                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  מקום:
                </Typography>
                <Typography variant="body2" sx={{ color: "text.primary", overflowWrap: "anywhere" }}>
                  {post.location}
                </Typography>
              </Stack>
            )}
            {post.damages && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                <RequestQuoteOutlinedIcon sx={{ fontSize: "1.1rem", color: "secondary.dark" }} />
                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  פיצוי מבוקש:
                </Typography>
                <Typography variant="body2" sx={{ color: "text.primary", overflowWrap: "anywhere" }}>
                  {post.damages}
                </Typography>
              </Stack>
            )}
          </Stack>
        )}

        {/* Vote bar */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: "error.main", fontWeight: 700 }}>
              חייב {guiltyPct}% ({guiltyVotes})
            </Typography>
            <Typography variant="caption" sx={{ color: "success.main", fontWeight: 700 }}>
              ({innocentVotes}) {innocentPct}% זכאי
            </Typography>
          </Box>
          <Box
            sx={{
              position: "relative",
              height: 10,
              borderRadius: 5,
              overflow: "hidden",
              backgroundColor: "rgba(26, 46, 79, 0.1)",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                width: `${totalVotes ? guiltyPct : 50}%`,
                background: "linear-gradient(90deg, #9B2C2C 0%, #B83838 100%)",
                transition: "width 0.4s ease-out",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                insetInlineEnd: 0,
                width: `${totalVotes ? innocentPct : 50}%`,
                background: "linear-gradient(270deg, #2F6B3E 0%, #3D8651 100%)",
                transition: "width 0.4s ease-out",
              }}
            />
          </Box>
          {totalVotes === 0 && !myVote && (
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5, fontStyle: "italic" }}>
              עוד אין הצבעות מושבעים
            </Typography>
          )}
          {myVote && (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.75 }}>
              <CheckIcon sx={{ fontSize: "0.9rem", color: myVote === "guilty" ? "error.main" : "success.main" }} />
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                הצבעתך נרשמה כ
                <Box
                  component="span"
                  sx={{ fontWeight: 700, color: myVote === "guilty" ? "error.main" : "success.main", mx: 0.25 }}
                >
                  {SIDE_LABEL[myVote]}
                </Box>
              </Typography>
            </Stack>
          )}
        </Box>

        {voteError && (
          <Typography variant="caption" sx={{ color: "error.main", display: "block", mt: 1 }}>
            {voteError}
          </Typography>
        )}
      </CardContent>

      {!preview && (
        <>
          <Divider />
          <CardActions sx={{ px: 2, py: 1.25, justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
            <Stack direction="row" spacing={1}>
              <Tooltip title={!currentUserId ? "התחבר כדי להצביע" : isOwner ? "אינך יכול להצביע על תביעתך" : ""}>
                <span>
                  <Button
                    size="small"
                    variant={myVote === "guilty" ? "contained" : "outlined"}
                    color="error"
                    disabled={!canVote || voting}
                    onClick={() => handleVote("guilty")}
                    startIcon={myVote === "guilty" ? <CheckIcon /> : <GavelOutlinedIcon />}
                    sx={{ fontWeight: myVote === "guilty" ? 700 : 500 }}
                  >
                    חייב!
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title={!currentUserId ? "התחבר כדי להצביע" : isOwner ? "אינך יכול להצביע על תביעתך" : ""}>
                <span>
                  <Button
                    size="small"
                    variant={myVote === "innocent" ? "contained" : "outlined"}
                    color="success"
                    disabled={!canVote || voting}
                    onClick={() => handleVote("innocent")}
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
                  onClick={() => onDelete(post.id)}
                  sx={{ color: "error.main" }}
                  aria-label="מחק תביעה"
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Tooltip>
            )}
          </CardActions>
        </>
      )}
    </Card>
  );
};
export default SinglePost;
