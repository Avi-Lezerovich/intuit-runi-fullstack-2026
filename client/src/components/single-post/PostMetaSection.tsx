/**
 * Optional metadata row at the bottom of a Post body: location and/or damages-sought.
 * The orchestrator skips rendering this entirely when both fields are empty.
 */
import { Stack, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";

interface PostMetaSectionProps {
  location?: string | null;
  damages?: string | null;
}

export const PostMetaSection = ({ location, damages }: PostMetaSectionProps) => (
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
  </Stack>
);
