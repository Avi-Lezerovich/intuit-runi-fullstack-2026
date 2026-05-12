/**
 * Row of outlined chips, one per charge/cause picked on the post.
 * The orchestrator skips rendering this entirely when `charges` is empty,
 * so the component itself can assume at least one charge.
 */
import { Chip, Stack } from "@mui/material";

interface PostChargesListProps {
  charges: string[];
}

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
          backgroundColor: "rgba(26, 46, 79, 0.04)",
        }}
      />
    ))}
  </Stack>
);
