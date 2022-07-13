import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@1.0.0/format/wc/index.ts";

function Page() {
  return (
    <>
      This is a 404 / fallback page (routes/*/page.tsx).
    </>
  );
}

export default toDist("react", Page, import.meta.url);
