import React from "https://npm.tfl.dev/react";
import { toWebComponent } from "https://tfl.dev/@truffle/web-component@1.0.0/index.js";

function ChildPage() {
  return (
    <div>
      This is my child page
    </div>
  );
}

export default toWebComponent('react', ChildPage, import.meta.url)