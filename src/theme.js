import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#31313aff", // ← Change this ONE place to change the whole app
    },
    secondary: {
      main: "#7d2537ff",
    },
  },
});

export default theme;
