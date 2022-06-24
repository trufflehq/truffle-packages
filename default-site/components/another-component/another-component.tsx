import React from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";

export default function AnotherComponent({ someProp }) {
  return (
    <div>
      Another component..: {someProp}
    </div>
  );
}

AnotherComponent.propTypes = {
  someProp: PropTypes.string,
};
