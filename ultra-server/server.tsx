import React from "react";
import { StaticRouter } from "react-router-dom/server";
import createServer from "https://raw.githubusercontent.com/austinhallock/ultra/v2/server.ts";
import { reactHelmetPlugin } from "https://raw.githubusercontent.com/austinhallock/ultra/v2/src/plugins/react-helmet.ts";
import { ServerAppProps } from "https://raw.githubusercontent.com/austinhallock/ultra/v2/src/types.ts";
import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";

// patch React.createElement to allow prop injection
import "https://tfl.dev/@truffle/utils@0.0.1/prop-injection/patch-react.js";

import App from "./app.tsx";

console.log("server...");

function ServerApp({ state }: ServerAppProps) {
  console.log("state", state);

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
    "https://tfl.dev/@truffle/ultra-server@0.1.0/client.tsx",
    "https://tfl.dev/@truffle/ultra-server@0.1.0/app.tsx",
  ],
});

server.register(reactHelmetPlugin);
server.start({ port: parseInt(Deno.env.get("SPOROCARP_PORT") || "8080") });
