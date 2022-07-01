import React from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import * as DialogPrimitive from "https://npm.tfl.dev/@radix-ui/react-dialog@0";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

import Stylesheet from "../stylesheet/stylesheet.jsx";

function DialogTitle({ children }) {
  return (
    <>
      <Stylesheet url={new URL("./dialog-title.css", import.meta.url)} />
      <DialogPrimitive.Title>
        {children}
      </DialogPrimitive.Title>
    </>
  );
}

DialogTitle.propTypes = {
  // htmlFor: PropTypes.string,
};

export default toWebComponent(DialogTitle);
