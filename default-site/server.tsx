import { Router } from "wouter";
import staticLocationHook from "wouter/static-location";
import createServer from "https://raw.githubusercontent.com/austinhallock/ultra/v2/server.ts";
import { reactHelmetPlugin } from "https://raw.githubusercontent.com/austinhallock/ultra/v2/src/plugins/react-helmet.ts";
import { ServerAppProps } from "https://raw.githubusercontent.com/austinhallock/ultra/v2/src/types.ts";

// patch React.createElement to allow prop injection
import 'https://tfl.dev/@truffle/utils@0.0.1/prop-injection/patch-react.js'

import globalContext from 'https://tfl.dev/@truffle/global-context@1.0.0/index.js'

import App from "./app/layout.tsx";

/**
 * This is the component that will be rendered server side.
 */
function ServerApp({ state }: ServerAppProps) {  
  // TODO: wrap this in globalContext.run when this is added:
  // https://github.com/denoland/deno/issues/5638#issuecomment-1147780998
  return globalContext.run({}, () =>
    <Router hook={staticLocationHook(state.url.pathname)}>
      <App state={state} />
    </Router>
  );
}

const server = await createServer(ServerApp, {
  // mode: "production", // let env var dictate
  bootstrapModules: ["./client.tsx"],
  // renderStrategy: 'static' // static | stream
});

/**
 * Register server plugins
 */
server.register(reactHelmetPlugin);

/**
 * Start the server!
 */
server.start({ port: 8000 });
