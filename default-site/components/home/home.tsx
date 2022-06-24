import React from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";

import AnotherComponent from "../another-component/another-component.tsx";

export default function DefaultSite({ exampleProp }) {
  return (
    <div>
      This is my default site, with variable.: {exampleProp}
      <AnotherComponent someProp="default prop" />
    </div>
  );
}

DefaultSite.propTypes = {
  exampleProp: PropTypes.string,
};
