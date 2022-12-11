import { React, useState, useStyleSheet } from "../../../deps.ts";
import styleSheet from "./switch.scss.js";

export default function Switch({
  value,
  onChange = () => undefined,
  label,
  showIsLoading = false,
}: {
  value?: boolean;
  onChange?: (value: boolean) => Promise<void> | void;
  label?: string;
  showIsLoading?: boolean;
}) {
  useStyleSheet(styleSheet);

  const [currentState, setCurrentState] = useState(false);
  const [isLoading, setLoadingState] = useState(false);
  const changeHandler = async () => {
    if (isLoading) return;

    const newVal = value === undefined ? !currentState : !value;
    setCurrentState(newVal);

    if (showIsLoading) {
      setLoadingState(true);

      // wait at least a second so that we don't have a ui flash
      await Promise.all([
        onChange?.(newVal),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      setLoadingState(false);
    } else {
      onChange?.(newVal);
    }
  };

  const className = `c-switch ${isLoading && "is-loading"}`;

  return (
    <label className={className}>
      {label && <div className="label">{label}</div>}
      <input
        type="checkbox"
        checked={value ?? currentState}
        onChange={changeHandler}
        disabled={isLoading}
      />
      <span className="slider round"></span>
    </label>
  );
}
