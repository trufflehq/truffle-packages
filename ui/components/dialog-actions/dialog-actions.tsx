import React from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

import Stylesheet from "../stylesheet/stylesheet.jsx";

function DialogActions({ children }) {
  return (
    <>
      <Stylesheet url={new URL("./dialog-actions.css", import.meta.url)} />
      <>
        {children}
      </>
    </>
  );
}

DialogActions.propTypes = {
  // htmlFor: PropTypes.string,
};

export default toWebComponent(DialogActions);
