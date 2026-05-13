import { Box } from "@mui/material";

const STAMP_RED = "#B33A3A";

/**
 * "Hot" indicator rendered as a tilted red rubber-stamp mark in the top-right
 * (RTL: top-`right` corner via insetInlineStart) of a Post card.
 * Only shown when total votes exceed the hot threshold (see SinglePost.tsx).
 *
 * The stamp is intentionally positioned slightly *outside* the card padding so
 * it doesn't collide with the centered PostCaseHeader text directly below.
 */
export const PostHotBadge = () => (
  <Box
    aria-label="חם עכשיו"
    sx={{
      position: "absolute",
      top: { xs: 6, sm: 10 },
      // insetInlineStart in RTL = right edge — the case header's center text
      // sits well clear of this corner, so no overlap.
      insetInlineStart: { xs: 8, sm: 14 },
      px: 1.2,
      py: 0.3,
      transform: { xs: "rotate(-8deg) scale(0.85)", sm: "rotate(-8deg)" },
      transformOrigin: "center",
      border: `2px solid ${STAMP_RED}`,
      outline: `1px solid ${STAMP_RED}`,
      outlineOffset: 2,
      borderRadius: "4px",
      backgroundColor: "transparent",
      color: STAMP_RED,
      fontFamily: '"Frank Ruhl Libre", serif',
      fontWeight: 800,
      fontSize: { xs: "0.7rem", sm: "0.8rem" },
      letterSpacing: "0.08em",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      zIndex: 2,
      userSelect: "none",
    }}
  >
    🔥 חם עכשיו
  </Box>
);
