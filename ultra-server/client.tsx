import React from "react";
import { hydrateRoot } from "react-dom/client";
import { Ultra } from "@ultra/react";
import { BrowserRouter } from "react-router-dom";
import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";

import App from "@ultra-server/app";

console.log("client...");

globalContext.setGlobalValue({});
hydrateRoot(
  document,
  <BrowserRouter>
    <Ultra>
      <App state={window.__ultra_renderState} />
    </Ultra>
  </BrowserRouter>,
);
