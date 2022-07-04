import React from "https://npm.tfl.dev/react";
import * as ReactDOM from "https://npm.tfl.dev/react-dom/client";
import reactToWebComponent from "./react-to-web-component.ts";

const isSsr = typeof document === "undefined";

export default function toWebComponent(
  ReactComponent,
  { isShadowDom = true } = {},
) {
  if (isSsr) return "div";
  const WebComponent = reactToWebComponent(ReactComponent, React, ReactDOM, {
    shadow: isShadowDom,
    dashStyleAttributes: true,
  });
  const randomStr = (Math.random() + 1).toString(36).substring(2);
  const kebabComponentName = ReactComponent.name.replace(
    /([a-z])([A-Z])/g,
    "$1-$2",
  )
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
  const componentName = `${kebabComponentName}-${randomStr}`;
  customElements.define(componentName, WebComponent);
  return componentName;
}
