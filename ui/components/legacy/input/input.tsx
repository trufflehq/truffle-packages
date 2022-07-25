import React, { useRef } from "https://npm.tfl.dev/react";
import useObservables from "https://tfl.dev/@truffle/utils@0.0.3/obs/use-observables-react.ts";
function Input({ valueSubject, type = "text", label, ref }) {
  const { currentValue } = useObservables(() => ({
    currentValue: valueSubject?.obs,
  }));
  const changeHandler = (e) => {
    valueSubject?.next(e.target.value);
  };
  const $ref = ref ?? useRef();
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "c-input",
    },
    label && /* @__PURE__ */ React.createElement("label", null, label),
    /* @__PURE__ */ React.createElement("input", {
      ref: $ref,
      type,
      value: currentValue ?? "",
      onInput: changeHandler,
    }),
  );
}
export { Input as default };
