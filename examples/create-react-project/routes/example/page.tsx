import React from "https://npm.tfl.dev/react";
import { toWebComponent } from "https://tfl.dev/@truffle/web-component@1.0.0/index.js";

function ExamplePage() {
  return "This is an example top-level route (/example)";
}

export default toWebComponent('react', ExamplePage, import.meta.url);