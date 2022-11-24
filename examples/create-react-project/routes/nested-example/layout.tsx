import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import Link from "https://tfl.dev/@truffle/router@^1.0.0/components/link/link.tag.ts";

function NestedExampleLayout({ children }) {
  return (
    <>
      This is a layout that applies to all nested children.
      <Link href={`/nested-example/${Math.random().toString().split(".")[1]}`}>
        Random
      </Link>
      {children}
    </>
  );
}

export default toDist(NestedExampleLayout, import.meta.url);
