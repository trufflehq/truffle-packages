import React from "https://npm.tfl.dev/react";
import { toWebComponent } from "https://tfl.dev/@truffle/web-component@1.0.0/index.js";

function Page() {
  return (
    <>
      This is a 404 / fallback page (routes/*/page.tsx).
    </>
  );
}

export default toWebComponent('react', Page, import.meta.url)