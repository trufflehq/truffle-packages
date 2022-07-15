import React from "https://npm.tfl.dev/react";
import isSsr from "https://tfl.dev/@truffle/utils@~0.0.2/ssr/is-ssr.ts";

import reactToWebComponent from "./react-to-web-component.ts";
import wcContainerContext from "./wc-container-context.ts";

import { addFormat, urlToTagName } from "../../shared.ts";

let ReactDOM;
const wcContainerContext = React.createContext();

async function getReactDOM() {
  ReactDOM = ReactDOM ||
    (isSsr
      ? (await import("https://npm.tfl.dev/react-dom/server"))?.default
      : (await import("https://npm.tfl.dev/react-dom/client"))?.default);
  return ReactDOM;
}

export function defineAndGetWebComponent(
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
        wcContainerContext,
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

export function useStylesheet(styleSheet) {
  React.useEffect(() => {
    const { context } = React.useContext(wcContainerContext);
    console.log("context", context, styleSheet);
  }, []);
}

export function toDist(component, url) {
  const tagName = urlToTagName(url);
  const base = defineAndGetWebComponent(component, tagName);
  return addFormat(base);
}
