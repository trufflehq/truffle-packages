import React from "https://npm.tfl.dev/react";
import * as ReactDOM from "https://npm.tfl.dev/react-dom/client";
import reactToWebComponent from "./react-to-web-component.ts";

const isSsr = typeof document === "undefined";

export default function toWebComponent(ReactComponent) {
  if (isSsr) return "div";
  // const WrappedComponent = (props) => {
  //   // react-to-webcomponent adds some props that break unmounting in react
  //   // both start with __react
  //   props = filterObjByKey(props, (key) => !key.startsWith("__react"));

  //   return React.createElement(ReactComponent, props);
  // };
  // WrappedComponent.propTypes = ReactComponent.propTypes;
  console.log("convert");

  const WebComponent = reactToWebComponent(ReactComponent, React, ReactDOM, {
    shadow: true,
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

function filterObjByKey(obj, match) {
  return Object.keys(obj)
    .filter(match)
    .reduce((res, key) => {
      res[key] = obj[key];
      return res;
    }, {});
}
