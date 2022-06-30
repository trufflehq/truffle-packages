import React from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

import Input, { propTypes as inputPropTypes } from "./input.entry.jsx";

function InputObs(props) {
  const { valueSubject } = props;

  const { value } = useObservables(() => ({
    value: valueSubject?.obs,
  }));

  const handleChange = (e) => {
    valueSubject?.next(e.target.value);
  };

  const newProps = {
    value,
    handleChange,
  };

  return <Input {...props} {...newProps} />;
}

InputObs.propTypes = {
  ...inputPropTypes,
  valueSubject: PropTypes.object,
};
console.log("proptypes", InputObs.propTypes);

export default toWebComponent(InputObs);
