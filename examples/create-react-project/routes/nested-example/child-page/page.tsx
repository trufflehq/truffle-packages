import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

function ChildPage() {
  return (
    <div>
      This is my child page
    </div>
  );
}

export default toDist(ChildPage, import.meta.url);
