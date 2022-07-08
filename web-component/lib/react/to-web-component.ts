import React from "https://npm.tfl.dev/react";

import reactToWebComponent from "./react-to-web-component.ts";

// TODO: smarter detection of node and deno in sep lib or context
const isSsr = typeof document === "undefined" ||
  globalThis?.process?.release?.name === "node";

let ReactDOM;

async function getReactDOM() {
  ReactDOM = ReactDOM ||
    (isSsr
      ? (await import("https://npm.tfl.dev/react-dom/server"))?.default
      : (await import("https://npm.tfl.dev/react-dom/client"))?.default);
  return ReactDOM;
}

export default function defineAndGetWebComponent(
  component,
  tagName,
  { isShadowDom = true } = {},
) {
  // wait til we know if we should use client or server react-dom
  const webComponent = getReactDOM().then((ReactDOM) => {
    const webComponent = reactToWebComponent(
      component,
      React,
      ReactDOM,
      {
        shadow: isShadowDom,
        dashStyleAttributes: true,
      },
    );
    customElements.define(tagName, webComponent);
  });

  return {
    libSlug: "react-to-web-component",
    libSemver: "1",
    webComponent,
  };
}
