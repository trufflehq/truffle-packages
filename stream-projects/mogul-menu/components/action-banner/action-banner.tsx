import { React, useStyleSheet } from "../../deps.ts";
import styleSheet from "./action-banner.scss.js";

export default function ActionBanner({
  action,
  children,
  classNamePostfix,
}: {
  action?: any;
  children?: any;
  classNamePostfix?: "twitch";
}) {
  useStyleSheet(styleSheet);
  return (
    <div className={`c-action-banner action-banner-style-${classNamePostfix}`}>
      <div className="info">{children}</div>
      <div className="action">{action}</div>
    </div>
  );
}
