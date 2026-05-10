import { createTheme, extendTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#393535",
    },
    secondary: {
      main: "#ccdae1",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default theme;
