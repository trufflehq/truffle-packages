import React from "react";
import { hydrateRoot } from "react-dom/client";
import { Ultra } from "@ultra/react";
import TopRouteLayout from "./routes/layout.tsx";

// patch React.createElement to allow prop injection
import "https://tfl.dev/@truffle/utils@0.0.1/prop-injection/patch-react.js";

import io from "https://tfl.dev/@truffle/api@0.0.1/legacy/io.js";
import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";

io.connect();
globalContext.setGlobalValue({});
hydrateRoot(
  document,
  <Ultra>
    <TopRouteLayout state={window.__ultra_renderState} />
  </Ultra>,
);
