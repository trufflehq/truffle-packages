import { React, useStyleSheet } from "../../deps.ts";
import Action from "../action/action.tsx";
import styleSheet from "./action-history.scss.js";

export default function ActionHistory() {
  useStyleSheet(styleSheet);
  return (
    <div className="c-action-history">
      <div className="header">Action history</div>
      <div className="actions-list">
        <Action mode="normal" />
        <Action mode="normal" />
        <Action mode="normal" />
      </div>
    </div>
  );
}
