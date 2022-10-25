import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.5/format/wc/react/index.ts";
import ThemeComponent from "https://tfl.dev/@truffle/mogul-menu@^0.1.59/components/base/theme-component/theme-component.tsx";

function RedirectLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}

export default toDist(RedirectLayout, import.meta.url);
