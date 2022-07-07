import React from "https://npm.tfl.dev/react";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

function ChildPage() {
  return (
    <div>
      This is my child page
    </div>
  );
}

export default toWebComponent(ChildPage)