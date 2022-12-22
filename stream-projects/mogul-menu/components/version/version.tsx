import { React, useStyleSheet } from "../../deps.ts";
import truffleConfig from "../../truffle.config.mjs";
import styleSheet from "./version.scss.js";

export default function Version() {
  useStyleSheet(styleSheet);
  return <div className="c-version">v{truffleConfig?.version}</div>;
}
