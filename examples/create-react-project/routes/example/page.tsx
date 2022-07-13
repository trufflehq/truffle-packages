import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^1.0.0/format/wc/index.ts";

function ExamplePage() {
  return "This is an example top-level route (/example)";
}

export default toDist("react", ExamplePage, import.meta.url);
