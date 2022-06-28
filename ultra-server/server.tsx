import React from "https://npm.tfl.dev/react";
import { StaticRouter } from "https://tfl.dev/@truffle/utils@0.0.1/router/server.js";
import createServer from "https://raw.githubusercontent.com/austinhallock/ultra/truffle/server.ts";
import { reactHelmetPlugin } from "https://raw.githubusercontent.com/austinhallock/ultra/truffle/src/plugins/react-helmet.ts";
import { ServerAppProps } from "https://raw.githubusercontent.com/austinhallock/ultra/truffle/src/types.ts";
import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";

import App from "./app.tsx";

// WARNING: DO NOT add anything to this file. everything we do should be self-contained within components.
// ie the components should be able to run in any environment, regardless of what the App/Client/Server looks like
// the only thing not self-contained is react-router, aka userLocation / useParams hooks.
// and these hooks should always be imported from "https://tfl.dev/@truffle/utils@0.0.1/router/router.js";
// rather than react-router directly (in case we need to change).
// for now, DO NOT use Helmet or react-streaming (useSsr/useAsync)

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
    "https://tfl.dev/@truffle/ultra-server@0.2.0/client.tsx",
    "https://tfl.dev/@truffle/ultra-server@0.2.0/app.tsx",
  ],
});

server.register(reactHelmetPlugin);
server.start({ port: parseInt(Deno.env.get("ULTRA_PORT") || "8000") });
