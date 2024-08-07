import { createTheme } from "@mui/material/styles/index.js";

export const theme = createTheme({
  shadows: ["none"],
  palette: {
    primary: {
      main: "#4361ee",
    },
  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 400,
    },
  },
});
