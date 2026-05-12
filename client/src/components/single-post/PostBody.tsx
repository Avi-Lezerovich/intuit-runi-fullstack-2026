import { Box, Button, Collapse, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useExpandableText } from "../../hooks/useExpandableText";

interface PostBodyProps {
  text: string;
  /** ב-preview mode הטקסט תמיד מורחב וכפתור "קרא עוד" לא מוצג. */
  preview?: boolean;
}

export const PostBody = ({ text, preview = false }: PostBodyProps) => {
  const { expanded, isLong, toggle } = useExpandableText({ text, forceExpanded: preview });

  return (
    <Box sx={{ position: "relative" }}>
      <Collapse in={expanded || !isLong} collapsedSize={isLong ? 72 : 0}>
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
          {text || (preview ? "פירוט הנסיבות יופיע כאן בזמן אמת בזמן ההקלדה." : "")}
        </Typography>
      </Collapse>
      {isLong && !preview && (
        <Button
          size="small"
          onClick={toggle}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ mt: 0.5, color: "primary.main" }}
        >
          {expanded ? "סגור" : "קרא עוד"}
        </Button>
      )}
    </Box>
  );
};
