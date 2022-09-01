import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.4/format/wc/react/index.ts";

import Mash from "../components/mash/mash.tsx";

function HomePage() {
  return <Mash />;
}

export default toDist(HomePage, import.meta.url);
