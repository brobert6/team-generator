import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
import { PlayersContextProvider } from "./store/player-context";
import { MantineProvider } from "@mantine/core";

ReactDOM.render(
  <PlayersContextProvider>
    <BrowserRouter>
      <MantineProvider theme={{ colorScheme: "light" }}>
        <App />
      </MantineProvider>
    </BrowserRouter>
  </PlayersContextProvider>,
  document.getElementById("root")
);
