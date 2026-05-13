/**
 * Row of outlined chips, one per charge/cause picked on the post.
 * The orchestrator skips rendering this entirely when `charges` is empty,
 * so the component itself can assume at least one charge.
 */
import { Chip, Stack } from "@mui/material";
import { DOC_FONT } from "../../theme";

interface PostChargesListProps {
  charges: string[];
}

/**
 * Renders one outlined Chip per charge/cause in a flexible row.
 * Parent should skip rendering this component entirely when the array is empty.
 * @param charges - Array of charge/cause labels to display as chips.
 */
export const PostChargesList = ({ charges }: PostChargesListProps) => (
  <Stack direction="row" spacing={0.75} sx={{ mb: 1.5, flexWrap: "wrap", gap: 0.75 }}>
    {charges.map((c) => (
      <Chip
        key={c}
        label={c}
        size="small"
        variant="outlined"
        sx={{
          borderColor: "primary.main",
          color: "primary.main",
          backgroundColor: "rgba(60, 52, 137, 0.05)",
          fontFamily: DOC_FONT,
          fontWeight: 700,
          letterSpacing: "0.04em",
          borderRadius: "4px",
        }}
      />
    ))}
  </Stack>
);
