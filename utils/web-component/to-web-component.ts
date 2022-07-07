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

export default function toWebComponent(
  ReactComponent,
  { isShadowDom = true } = {},
) {
  const randomStr = (Math.random() + 1).toString(36).substring(2);
  const kebabComponentName = ReactComponent.name.replace(
    /([a-z])([A-Z])/g,
    "$1-$2",
  )
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
  const componentName = `${kebabComponentName}-${randomStr}`;
  console.log("webcomp", componentName);

  // wait til we know if we should use client or server react-dom
  getReactDOM().then((ReactDOM) => {
    const WebComponent = reactToWebComponent(
      ReactComponent,
      React,
      ReactDOM,
      {
        shadow: isShadowDom,
        dashStyleAttributes: true,
      },
    );
    customElements.define(componentName, WebComponent);
  });

  return componentName;
}
