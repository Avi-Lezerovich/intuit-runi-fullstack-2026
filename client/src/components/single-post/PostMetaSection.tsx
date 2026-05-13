/**
 * Optional metadata row at the bottom of a Post body: location and/or damages-sought.
 * The orchestrator skips rendering this entirely when both fields are empty.
 */
import { Box, Stack, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import { DOC_FONT } from "../../theme";
import { formatRelative } from "../../utils/dateUtils";

interface PostMetaSectionProps {
  location?: string | null;
  damages?: string | null;
  /** Signing party shown in the signature block (italic name above a rule). */
  signedBy?: string;
  /** ISO timestamp used to render the "ניתן · X" date line under the signature. */
  createdAt?: string;
  /** In preview mode the signature block is suppressed. */
  preview?: boolean;
}

/**
 * Renders the optional location + damages-sought metadata rows at the bottom of a Post card.
 * Each row is individually conditional; the parent skips this whole component when both are empty.
 * @param location - Optional location string; if provided, renders with LocationOnOutlinedIcon.
 * @param damages - Optional damages-sought string; if provided, renders with RequestQuoteOutlinedIcon.
 */
export const PostMetaSection = ({ location, damages, signedBy, createdAt, preview = false }: PostMetaSectionProps) => (
  <Stack
    spacing={0.75}
    sx={{
      mt: 2,
      pt: 1.5,
      borderTop: "1px dashed",
      borderColor: "divider",
    }}
  >
    {location && (
      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
        <LocationOnOutlinedIcon sx={{ fontSize: "1.1rem", color: "secondary.dark" }} />
        <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
          מקום:
        </Typography>
        <Typography variant="body2" sx={{ color: "text.primary", overflowWrap: "anywhere" }}>
          {location}
        </Typography>
      </Stack>
    )}
    {damages && (
      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
        <RequestQuoteOutlinedIcon sx={{ fontSize: "1.1rem", color: "secondary.dark" }} />
        <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
          פיצוי מבוקש:
        </Typography>
        <Typography variant="body2" sx={{ color: "text.primary", overflowWrap: "anywhere" }}>
          {damages}
        </Typography>
      </Stack>
    )}
    {!preview && signedBy && (
      <Box
        sx={{
          mt: 1.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          textAlign: "end",
        }}
      >
        <Box
          sx={{
            width: 160,
            borderTop: "1px solid",
            borderColor: "text.secondary",
            opacity: 0.7,
            mb: 0.4,
          }}
        />
        <Typography
          sx={{
            fontStyle: "italic",
            fontFamily: DOC_FONT,
            fontWeight: 600,
            color: "text.primary",
            fontSize: "0.95rem",
            lineHeight: 1.2,
          }}
        >
          {signedBy}
        </Typography>
        {createdAt && (
          <Typography
            variant="caption"
            sx={{
              fontFamily: DOC_FONT,
              color: "text.secondary",
              fontSize: "0.72rem",
              mt: 0.15,
            }}
          >
            ניתן · {formatRelative(createdAt)}
          </Typography>
        )}
      </Box>
    )}
  </Stack>
);
