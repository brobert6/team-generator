import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import LogRocket from 'logrocket';
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
import { PlayersContextProvider } from "./store/player-context";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

LogRocket.init('lerzk2/team-generator');

ReactDOM.render(
  <PlayersContextProvider>
    {/* <BrowserRouter basename={"/team-generator"}> */}
    <BrowserRouter>
      <MantineProvider theme={{ colorScheme: "light" }}>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </MantineProvider>
    </BrowserRouter>
  </PlayersContextProvider>,
  document.getElementById("root")
);
