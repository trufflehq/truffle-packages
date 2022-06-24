import React, { useMemo } from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import { AuthDialog$ } from "https://tfl.dev/@truffle/ui@0.0.1/components/auth-dialog/auth-dialog.jsx";
import { createSubject } from "https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js";

import AnotherComponent from "../another-component/another-component.tsx";

export default function DefaultSite({ exampleProp }) {
  const { isOpenSubject } = useMemo(() => {
    return {
      isOpenSubject: createSubject(false),
    };
  }, []);

  return (
    <div>
      This is my default site, with variable.: {exampleProp}
      <AnotherComponent someProp="default prop" />
      <button
        onClick={() => {
          isOpenSubject.next(true);
        }}
      >
        test
      </button>
      <AuthDialog$ isOpenSubject={isOpenSubject} />
    </div>
  );
}

DefaultSite.propTypes = {
  exampleProp: PropTypes.string,
};
