import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import Chants from "../components/chants/chant.tsx";

import Home from "../components/home/home.tsx";

function HomePage() {
  return <Home />;
}

export default toDist(HomePage, import.meta.url);
