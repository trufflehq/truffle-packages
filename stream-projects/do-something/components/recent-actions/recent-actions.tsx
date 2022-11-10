import { React, useStyleSheet } from "../../deps.ts";
import Action from "../action/action.tsx";
import styleSheet from "./recent-actions.scss.js";

export default function RecentActions() {
  useStyleSheet(styleSheet);
  return (
    <div className="c-recent-actions">
      <div className="header">Most recent actions</div>
      <div className="actions-list">
        <Action mode="recent" state="recently-redeemed" />
        <Action mode="recent" state="last-redeemed" />
        <Action mode="recent" state="normal" />
      </div>
    </div>
  );
}
