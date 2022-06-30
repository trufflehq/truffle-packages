import React from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

import Input from "./input.entry.jsx";

function InputObs(props) {
  const { valueSubject } = props;

  const { value } = useObservables(() => ({
    value: valueSubject?.obs,
  }));

  const onChange = (e) => {
    valueSubject?.next(e.target.value);
  };

  const newProps = {
    value,
    onChange,
  };

  return <Input {...props} {...newProps} />;
}

InputObs.propTypes = {
  ...Input.propTypes,
  valueSubject: PropTypes.object,
};

export default toWebComponent(InputObs);
