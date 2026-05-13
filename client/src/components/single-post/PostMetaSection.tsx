/**
 * Optional metadata row at the bottom of a Post body: location and/or damages-sought.
 * The orchestrator skips rendering this entirely when both fields are empty.
 */
import { Stack, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import { DOC_FONT } from "../../theme";

interface PostMetaSectionProps {
  location?: string | null;
  damages?: string | null;
  /** Signing party shown in the italic signature line under the metadata. */
  signedBy?: string;
  /** In preview mode the signature line is suppressed. */
  preview?: boolean;
}

/**
 * Renders the optional location + damages-sought metadata rows at the bottom of a Post card.
 * Each row is individually conditional; the parent skips this whole component when both are empty.
 * @param location - Optional location string; if provided, renders with LocationOnOutlinedIcon.
 * @param damages - Optional damages-sought string; if provided, renders with RequestQuoteOutlinedIcon.
 */
export const PostMetaSection = ({ location, damages, signedBy, preview = false }: PostMetaSectionProps) => (
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
      <Typography
        sx={{
          mt: 1,
          textAlign: "end",
          fontStyle: "italic",
          fontFamily: DOC_FONT,
          color: "text.secondary",
          fontSize: "0.9rem",
        }}
      >
        — נחתם בידי {signedBy}
      </Typography>
    )}
  </Stack>
);
