import React from "https://npm.tfl.dev/react";
// TODO use esm.sh or oscar to conditionally load in react-dom client/server dep on env
// using dynamic imports doesn't work, bc we need defineAndGetWebComponent to be sync, not async
import ReactDOM from "https://npm.tfl.dev/react-dom/client";
// for safari
import "https://npm.tfl.dev/construct-style-sheets-polyfill@3.1.0";

import reactToWebComponent from "./react-to-web-component.ts";
// always keep at ^1.0.0
import wcContainerContext from "https://tfl.dev/@truffle/shared-contexts@^1.0.0/contexts/distribute/react-wc-container.ts";

import { addFormat, urlToTagName } from "../shared.ts";

export function defineAndGetWebComponent(
  component,
  tagName,
  { isShadowDom = true } = {},
) {
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

  return {
    libSlug: "react-to-web-component",
    libSemver: "1",
    webComponent,
  };
}

// grab current shadowRoot from context and set adoptedStylesheets
// pass in CSSStyleSheet (get from import assert css)
export function useStyleSheet(styleSheet) {
  // provider is wrapped around element in react-to-web-component.js
  const context = React.useContext(wcContainerContext);
  // memo instead of useEffect so it's synchronous
  React.useMemo(() => {
    if (context?.container) {
      const adoptedStyleSheets = context.container.adoptedStyleSheets || [];
      context.container.adoptedStyleSheets = [
        ...adoptedStyleSheets,
        styleSheet,
      ];
    }
  }, []);
}

export function toDist(component, url) {
  const tagName = urlToTagName(url);
  const base = defineAndGetWebComponent(component, tagName);
  return addFormat({ ...base, tagName });
}
