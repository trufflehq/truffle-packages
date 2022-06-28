import React from "https://npm.tfl.dev/react";
import { hydrateRoot } from "https://npm.tfl.dev/react-dom/client";
import { BrowserRouter } from "https://tfl.dev/@truffle/utils@0.0.1/router/router.js";
import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";
// import { useSsrData } from "https://npm.tfl.dev/react-streaming@0";
// see ./react-streaming/README.md
import { ReactStreaming } from "./react-streaming/client.js";

import App from "./app.tsx";

// WARNING: DO NOT add anything to this file. everything we do should be self-contained within components.
// ie the components should be able to run in any environment, regardless of what the App/Client/Server looks like
// the only thing not self-contained is react-router, aka userLocation / useParams hooks.
// and these hooks should always be imported from "https://tfl.dev/@truffle/utils@0.0.1/router/router.js";
// rather than react-router directly (in case we need to change).
// for now, DO NOT use Helmet or react-streaming (useSsr/useAsync)

globalContext.setGlobalValue({});
hydrateRoot(
  document,
  <BrowserRouter>
    <ReactStreaming>
      <App state={window.__ultra_renderState} />
    </ReactStreaming>
  </BrowserRouter>,
);
