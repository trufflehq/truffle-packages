import React from "https://npm.tfl.dev/react";
import { hydrateRoot } from "https://npm.tfl.dev/react-dom/client";
import { BrowserRouter } from "https://tfl.dev/@truffle/utils@0.0.1/router/router.js";
import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";
// import { useSsrData } from "https://npm.tfl.dev/react-streaming@0";
// see ./react-streaming/README.md
import { ReactStreaming } from "./react-streaming/client.js";

import App from "./app.tsx";

console.log("client...");

globalContext.setGlobalValue({});
hydrateRoot(
  document,
  <BrowserRouter>
    <ReactStreaming>
      <App state={window.__ultra_renderState} />
    </ReactStreaming>
  </BrowserRouter>,
);
