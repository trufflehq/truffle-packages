import React from "https://npm.tfl.dev/react";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

function ExamplePage() {
  return "This is an example top-level route (/example)";
}

export default toWebComponent(ExamplePage)