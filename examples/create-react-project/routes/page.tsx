import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/index.ts";

import Home from "../components/home/home.tsx";

function HomePage() {
  return <Home />;
}

export default toDist("react", HomePage, import.meta.url);
