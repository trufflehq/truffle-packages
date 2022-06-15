import React from 'react';
import { createRoot } from "react-dom/client";
import { Ultra } from "@ultra/react";
import App from "./app/layout.tsx";

// patch React.createElement to allow prop injection
import 'https://tfl.dev/@truffle/utils@0.0.1/prop-injection/patch-react.js'

import io from 'https://tfl.dev/@truffle/api@0.0.1/legacy/io.js'
import globalContext from 'https://tfl.dev/@truffle/global-context@1.0.0/index.js'

io.connect()
globalContext.setGlobalValue({})
// need min 18.2.0 for hydrateRoot/createRoot to work properly
// https://github.com/remix-run/remix/issues/2947#issuecomment-1130799334
// it also doesn't really work since we suspense on server atm
// TODO: switch back to hydrateRoot when deno supports assert css and has asynclocalstorage
const root = createRoot(document);
root.render(
  <Ultra>
    <App state={window.__ultra_renderState} />
  </Ultra>
);