import React from "react";
import PropTypes from "prop-types";

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
