import React from "react";
import { Helmet, HelmetProvider } from "react-helmet";
import { Route, Router, Switch } from "wouter";
import type { RenderState } from "https://raw.githubusercontent.com/austinhallock/ultra/v2/server.ts";
import { useAsync } from "@ultra/react";

import { TruffleSetup } from "https://tfl.dev/@truffle/utils@0.0.1/ultra/setup.jsx";

import HomePage from "./home/page.tsx";

type AppProps = {
  state: RenderState;
};

const Ultra = ({ state }: AppProps) => {
  return (
    <HelmetProvider context={state}>
      <html lang="en">
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html:
                `window.esmsInitOptions = { polyfillEnable: ['css-modules', 'json-modules'] }`,
            }}
          >
          </script>
          <script
            async
            src="https://unpkg.com/construct-style-sheets-polyfill@3.1.0/dist/adoptedStyleSheets.js"
          >
          </script>
          <script
            async
            src="https://ga.jspm.io/npm:es-module-shims@1.5.6/dist/es-module-shims.js"
          >
          </script>
          <script
            type="importMap"
            dangerouslySetInnerHTML={{
              __html: `{
              "imports": {
                "react": "https://npm.tfl.dev/react@18?dev",
                "react-dom": "https://npm.tfl.dev/react-dom@18?dev",
                "prop-types": "https://npm.tfl.dev/prop-types"
              }
            }`,
            }}
          />
          <Helmet>
            <title>Example Page</title>
            <link rel="stylesheet" href="/public/global.css" />
          </Helmet>
        </head>
        <body>
          <TruffleSetup state={state} useAsync={useAsync}>
            <main>
              <Router>
                <Route path="/:abc">
                  aa
                  <Router base="/:abc">
                    <Route path="/a">
                      <div>inner</div>
                    </Route>
                  </Router>
                </Route>
              </Router>
              {
                /* <Switch>
                <Route>
                  <HomePage state={state} />
                </Route>
              </Switch> */
              }
            </main>
          </TruffleSetup>
        </body>
      </html>
    </HelmetProvider>
  );
};

export default Ultra;
