import { Box, Stack, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import type { VoteSide } from "../../types";

const SIDE_LABEL: Record<VoteSide, string> = { guilty: "חייב", innocent: "זכאי" };

interface PostVoteBarProps {
  guiltyVotes: number;
  innocentVotes: number;
  myVote: VoteSide | null;
}

export const PostVoteBar = ({ guiltyVotes, innocentVotes, myVote }: PostVoteBarProps) => {
  const totalVotes = guiltyVotes + innocentVotes;
  const guiltyPct = totalVotes ? Math.round((guiltyVotes / totalVotes) * 100) : 0;
  const innocentPct = totalVotes ? 100 - guiltyPct : 0;

  return (
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
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
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
  );
};
