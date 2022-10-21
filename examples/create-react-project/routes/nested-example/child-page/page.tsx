import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.19/format/wc/react/index.ts";

function ChildPage() {
  return (
    <div>
      This is my child page
    </div>
  );
}

export default toDist(ChildPage, import.meta.url);
