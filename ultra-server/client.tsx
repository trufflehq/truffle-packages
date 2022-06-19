import React from "react";
import { hydrateRoot } from "react-dom/client";
import { Ultra } from "@ultra/react";
import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";

// patch React.createElement to allow prop injection
import "https://tfl.dev/@truffle/utils@0.0.1/prop-injection/patch-react.js";

import App from "@ultra-server/app";

console.log("client...");

globalContext.setGlobalValue({});
hydrateRoot(
  document,
  <Ultra>
    <App state={window.__ultra_renderState} />
  </Ultra>,
);
