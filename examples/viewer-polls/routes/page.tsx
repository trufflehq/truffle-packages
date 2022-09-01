import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.4/format/wc/react/index.ts";

import Vote from "../components/vote/vote.tsx";

function HomePage() {
  return <Vote />;
}

export default toDist(HomePage, import.meta.url);
