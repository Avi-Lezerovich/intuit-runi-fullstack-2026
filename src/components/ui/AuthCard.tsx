import * as React from "react";
import MuiCard, { CardProps } from "@mui/material/Card";
import { styled } from "@mui/material/styles";

const StyledCard = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

/**
 * Reusable auth card component.
 * Provides consistent styling across sign-up and sign-in forms.
 */
const AuthCard = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => <StyledCard ref={ref} variant="outlined" {...props} />
);

AuthCard.displayName = "AuthCard";

export default AuthCard;
