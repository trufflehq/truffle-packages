import React from "https://npm.tfl.dev/react";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

import Stylesheet from "../stylesheet/stylesheet.jsx";

function FormLabel(props) {
  console.log("props", props);

  return (
    <div className="c-label">
      <Stylesheet url={new URL("./form-label.css", import.meta.url)} />
      {props.children}
    </div>
  );
}

export default toWebComponent(FormLabel);
