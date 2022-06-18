import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MyRoutes } from "./routes";
import { createTheme, ThemeProvider } from "@material-ui/core";

const darkTheme = createTheme({
  palette: {
    type: "dark",
    primary: {
      light: "#7986cb",
      main: "#fab732",
      dark: "#303f9f",
      contrastText: "#fff",
    },
  },
});
export default function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {/* <Container fixed> */}
        <MyRoutes></MyRoutes>
        {/* </Container> */}
      </ThemeProvider>
    </React.Fragment>
  );
}
