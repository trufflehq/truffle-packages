import React from "https://npm.tfl.dev/react";
import {
  Helmet,
  HelmetProvider,
} from "https://npm.tfl.dev/react-helmet-async@1";
import type { RenderState } from "https://raw.githubusercontent.com/austinhallock/ultra/truffle3/server.ts";
// import { useSsrData } from "https://npm.tfl.dev/react-streaming@0";
// see ./react-streaming/README.md
import { useSsrData } from "./react-streaming/useSsrData.js";

// as of june 2022, import mapping required for ultra to know to compile these files
import { TruffleSetup } from "./setup.jsx";
import FsRouter from "./fs-router.tsx";

type AppProps = {
  state: RenderState;
};

const Ultra = ({ state }: AppProps) => {
  return (
    <HelmetProvider context={state}>
      <html lang="en">
        <head>
          <Helmet>
            <title>Example Page</title>
            <link rel="stylesheet" href="/public/global.css" />
          </Helmet>
        </head>
        <body>
          <TruffleSetup state={state} useSsrData={useSsrData}>
            <FsRouter state={state} />
          </TruffleSetup>
        </body>
      </html>
    </HelmetProvider>
  );
};

export default Ultra;
