import React from "https://npm.tfl.dev/react";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

function NestedExampleLayout({ children }) {
  return (
    <div>
      This is a layout that applies to all nested children
      {children}
    </div>
  );
}

export default toWebComponent(NestedExampleLayout)