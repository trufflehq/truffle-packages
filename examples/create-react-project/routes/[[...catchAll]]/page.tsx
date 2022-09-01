import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.4/format/wc/react/index.ts";

function Page() {
  return (
    <>
      This is a 404 / fallback page (routes/*/page.tsx).
    </>
  );
}

export default toDist(Page, import.meta.url);
