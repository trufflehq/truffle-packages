import React from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

import { Dialog$ } from "../dialog/dialog.tsx";
import AuthDialog from "./auth-dialog.entry.tsx";

function AuthDialogObs(props) {
  const newProps = {
    Dialog: Dialog$,
  };

  return <AuthDialog {...props} {...newProps} />;
}

AuthDialogObs.propTypes = {
  isOpenSubject: PropTypes.object,
};

export default toWebComponent(AuthDialogObs);
