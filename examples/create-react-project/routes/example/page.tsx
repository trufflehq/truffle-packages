import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.19/format/wc/react/index.ts";

function ExamplePage() {
  return "This is an example top-level route (/example)";
}

export default toDist(ExamplePage, import.meta.url);
