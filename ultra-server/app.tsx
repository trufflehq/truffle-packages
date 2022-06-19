import React from "react";
import { Helmet, HelmetProvider } from "react-helmet";
import type { RenderState } from "https://raw.githubusercontent.com/austinhallock/ultra/v2/server.ts";
import { useAsync } from "@ultra/react";

// as of june 2022, import mapping required for ultra to know to compile these files
import { TruffleSetup } from "@ultra-server/setup";
import FsRouter from "@ultra-server/fs-router";

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
                `window.esmsInitOptions = { polyfillEnable: ['json-modules'] }`,
            }}
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
                "prop-types": "https://npm.tfl.dev/prop-types",
                "react": "https://npm.tfl.dev/react@18?dev",
                "react/jsx-runtime": "https://npm.tfl.dev/react@18/jsx-runtime.js?dev",
                "react/jsx-dev-runtime": "https://npm.tfl.dev/react@18/jsx-dev-runtime.js?dev",
                "react-dom": "https://npm.tfl.dev/react-dom@18?dev",
                "react-dom/client": "https://npm.tfl.dev/react-dom@18/client?dev",
                "react-dom/server": "https://npm.tfl.dev/react-dom@18/server?dev",
                "react-helmet": "https://npm.tfl.dev/react-helmet-async?deps=react@18&dev",
                "react-router-dom": "https://npm.tfl.dev/react-router-dom@6?deps=react@18&dev",
                "react-router-dom/server": "https://npm.tfl.dev/react-router-dom@6/server?deps=react@18&dev",
                "@ultra/react": "https://raw.githubusercontent.com/austinhallock/ultra/v2/react.ts"
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
            <FsRouter state={state} />
          </TruffleSetup>
        </body>
      </html>
    </HelmetProvider>
  );
};

export default Ultra;
