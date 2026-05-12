import { Box, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SinglePost from "../SinglePost";
import type { Post } from "../../types";

export const PostPreviewPanel = ({ previewPost }: { previewPost: Post }) => (
  <Box sx={{ flex: 1, width: "100%", position: { lg: "sticky" }, top: { lg: 80 } }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
      <VisibilityIcon sx={{ color: "primary.main" }} />
      <Typography variant="h6" sx={{ fontFamily: '"Frank Ruhl Libre", serif', color: "primary.main" }}>
        תצוגה מקדימה
      </Typography>
    </Box>
    <Box sx={{ border: "2px dashed rgba(184, 134, 11, 0.4)", borderRadius: 2, p: { xs: 1, sm: 2 }, backgroundColor: "rgba(184, 134, 11, 0.03)" }}>
      <SinglePost post={previewPost} preview />
    </Box>
    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 1.5, textAlign: "center", fontStyle: "italic" }}>
      כך הקהילה תראה את התביעה. תוכן מתעדכן בזמן אמת.
    </Typography>
  </Box>
);