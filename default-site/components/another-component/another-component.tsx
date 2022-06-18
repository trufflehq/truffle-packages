import React from "react";
import PropTypes from "prop-types";

export default function AnotherComponent({ someProp }) {
  return (
    <div>
      Another component...: {someProp}
    </div>
  );
}

AnotherComponent.propTypes = {
  someProp: PropTypes.string,
};
