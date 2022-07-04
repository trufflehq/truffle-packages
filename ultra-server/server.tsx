import React from "https://npm.tfl.dev/react";
import { StaticRouter } from "https://tfl.dev/@truffle/utils@0.0.1/router/server.js";
import createServer from "https://raw.githubusercontent.com/austinhallock/ultra/truffle3/server.ts";
import { reactHelmetPlugin } from "https://raw.githubusercontent.com/austinhallock/ultra/truffle3/src/plugins/react-helmet.ts";
import { ServerAppProps } from "https://raw.githubusercontent.com/austinhallock/ultra/truffle3/src/types.ts";
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
    "https://tfl.dev/@truffle/ultra-server@0.3.0/client.js",
    "https://tfl.dev/@truffle/ultra-server@0.3.0/app.js",
  ],
});

server.register(reactHelmetPlugin);
server.start({ port: parseInt(Deno.env.get("ULTRA_PORT") || "8000") });
