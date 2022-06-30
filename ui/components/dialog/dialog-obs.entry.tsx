import React from "https://npm.tfl.dev/react";
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";

import Dialog from "../dialog.entry.tsx";

export function DialogObs(props) {
  const { isOpenSubject } = props;

  const { isOpen } = useObservables(() => ({
    isOpen: isOpenSubject.obs,
  }));

  const newProps = {
    isOpen,
    onClose: () => {
      console.log("close...");
      isOpenSubject.next(false);
      props.onClose?.();
    },
  };

  return <Dialog {...props} {...newProps} />;
}
