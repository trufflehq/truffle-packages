import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/index.ts";

function Layout({ children }) {
  // initial theme styles
  return (
    <>
      <style>
        {`
      :host {
        background: var(--tfl-color-bg-fill);
        color: var(--tfl-color-on-bg-fill);
        font-family: var(--tfl-font-family-body-sans);
        display: block;
        width: 100%;
        height: 100%;
      }
    `}
      </style>
      {children}
    </>
  );
}

export default toDist("react", Layout, import.meta.url);
