import React from "react";
import { StaticRouter } from "react-router-dom/server";
import createServer from "https://raw.githubusercontent.com/austinhallock/ultra/v2/server.ts";
import { reactHelmetPlugin } from "https://raw.githubusercontent.com/austinhallock/ultra/v2/src/plugins/react-helmet.ts";
import { ServerAppProps } from "https://raw.githubusercontent.com/austinhallock/ultra/v2/src/types.ts";
import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";

import App from "./app.tsx";

function ServerApp({ state }: ServerAppProps) {
  return globalContext.run(
    {},
    () => (
      <StaticRouter location={state.url.pathname}>
        <App state={state} />
      </StaticRouter>
    ),
  );
}

const server = await createServer(ServerApp, {
  bootstrapModules: [
    "https://tfl.dev/@truffle/ultra-server@0.1.1/client.tsx",
    "https://tfl.dev/@truffle/ultra-server@0.1.1/app.tsx",
  ],
});

server.register(reactHelmetPlugin);
server.start({ port: parseInt(Deno.env.get("ULTRA_PORT") || "8000") });
