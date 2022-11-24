import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import Vote from "../components/vote/vote.tsx";

function HomePage() {
  return <Vote />;
}

export default toDist(HomePage, import.meta.url);
