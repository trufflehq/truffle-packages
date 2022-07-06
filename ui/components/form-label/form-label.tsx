import React from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

import Stylesheet from "../stylesheet/stylesheet.jsx";

function FormLabel(props) {
  console.log("props", props);

  return (
    <label className="c-label" htmlFor={props.htmlFor}>
      <Stylesheet url={new URL("./form-label.css", import.meta.url)} />
      {props.children}
    </label>
  );
}

FormLabel.propTypes = {
  htmlFor: PropTypes.string,
};

export default toWebComponent(FormLabel);
