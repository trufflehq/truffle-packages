import React from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import * as DialogPrimitive from "https://npm.tfl.dev/@radix-ui/react-dialog@0";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

import Icon from "../icon/icon.jsx";
import Stylesheet from "../stylesheet/stylesheet.jsx";

function DialogClose({ children }) {
  const close = () => {}; // FIXME context?
  return (
    <>
      <Stylesheet url={new URL("./dialog-title.css", import.meta.url)} />
      <DialogPrimitive.Close onClick={close}>
        <Icon icon="close" />
      </DialogPrimitive.Close>
    </>
  );
}

DialogClose.propTypes = {
  // htmlFor: PropTypes.string,
};

export default toWebComponent(DialogClose);
