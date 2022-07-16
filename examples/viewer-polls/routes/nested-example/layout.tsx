import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts";

function NestedExampleLayout({ children }) {
  return (
    <>
      This is a layout that applies to all nested children
      {children}
    </>
  );
}

export default toDist(NestedExampleLayout, import.meta.url);
