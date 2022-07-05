import React from "https://npm.tfl.dev/react";
import {
  Helmet,
  HelmetProvider,
} from "https://npm.tfl.dev/react-helmet-async@1";
import type { RenderState } from "https://raw.githubusercontent.com/austinhallock/ultra/truffle3/server.ts";
import ThemeComponent from "https://tfl.dev/@truffle/ui@0.0.2/components/theme/theme-component.js";
// import { useSsrData } from "https://npm.tfl.dev/react-streaming@0";
// see ./react-streaming/README.md
import { useSsrData } from "./react-streaming/useSsrData.js";

// as of june 2022, import mapping required for ultra to know to compile these files
import { TruffleSetup } from "./setup.jsx";
import FsRouter from "./fs-router.tsx";

type AppProps = {
  state: RenderState;
};

// WARNING: DO NOT add anything to this file. everything we do should be self-contained within components.
// ie the components should be able to run in any environment, regardless of what the App/Client/Server looks like
// the only thing not self-contained is react-router, aka userLocation / useParams hooks.
// and these hooks should always be imported from "https://tfl.dev/@truffle/utils@0.0.1/router/router.js";
// rather than react-router directly (in case we need to change).
// for now, DO NOT use Helmet or react-streaming (useSsr/useAsync)

const Ultra = ({ state }: AppProps) => {
  return (
    <HelmetProvider context={state}>
      <html lang="en">
        <head>
          <Helmet>
            <title>Truffle</title>
          </Helmet>
        </head>
        <body>
          <ThemeComponent />
          <TruffleSetup state={state} useSsrData={useSsrData}>
            <FsRouter state={state} />
          </TruffleSetup>
        </body>
      </html>
    </HelmetProvider>
  );
};

export default Ultra;
