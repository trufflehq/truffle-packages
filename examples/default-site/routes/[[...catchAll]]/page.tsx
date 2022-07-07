import React from "https://npm.tfl.dev/react";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

function Page() {
  return (
    <>
      This is a 404 / fallback page (routes/*/page.tsx).
    </>
  );
}

export default toWebComponent(Page)