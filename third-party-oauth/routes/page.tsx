import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.19/format/wc/react/index.ts";

function HomePage() {
  return <div>henlo</div>;
}

export default toDist(HomePage, import.meta.url);
