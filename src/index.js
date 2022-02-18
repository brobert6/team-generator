import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
import { PlayersContextProvider } from "./store/player-context";

ReactDOM.render(
  <PlayersContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PlayersContextProvider>,
  document.getElementById("root")
);
