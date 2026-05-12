import { Chip } from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

export const PostHotBadge = () => (
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
);
