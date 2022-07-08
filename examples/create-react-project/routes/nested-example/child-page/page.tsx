import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@1.0.0/format/wc/index.js";

function ChildPage() {
  return (
    <div>
      This is my child page
    </div>
  );
}

export default toDist('react', ChildPage, import.meta.url)