import React from "https://npm.tfl.dev/react";
import { toWebComponent } from "https://tfl.dev/@truffle/web-component@1.0.0/index.js";

function NestedExampleLayout({ children }) {
  return <>
    This is a layout that applies to all nested children
    {children}
  </>
}

export default toWebComponent('react', NestedExampleLayout, import.meta.url)