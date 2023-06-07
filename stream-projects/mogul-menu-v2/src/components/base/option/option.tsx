import { React, useStyleSheet } from "../../../deps.ts";
import styleSheet from "./option.scss.js";

export default function Option({
  children,
  value,
  disabled,
  defaultOption,
}: {
  children?: any;
  value?: string;
  disabled?: boolean;
  defaultOption?: boolean;
}) {
  useStyleSheet(styleSheet);
  return <div className="c-option">{children}</div>;
}
