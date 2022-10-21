import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.19/format/wc/react/index.ts";
import ThemeComponent from "https://tfl.dev/@truffle/mogul-menu@^0.1.59/components/base/theme-component/theme-component.tsx";

function AuthLayout({ children }) {
  return (
    <>
      <ThemeComponent />
      {children}
    </>
  );
}

export default toDist(AuthLayout, import.meta.url);
