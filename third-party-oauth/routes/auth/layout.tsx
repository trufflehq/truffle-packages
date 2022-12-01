import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import ThemeComponent from "../../components/theme-component/theme-component.tsx";

function AuthLayout({ children }) {
  return (
    <>
      <ThemeComponent />
      {children}
    </>
  );
}

export default toDist(AuthLayout, import.meta.url);
