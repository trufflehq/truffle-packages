import { Avatar, React, useStyleSheet } from "../../deps.ts";
import styleSheet from "./action.scss.js";
import { Action } from "../../shared/types/action.ts";
import { timeAgo } from "../../shared/util/time-ago.ts";

type StringObj = Record<string, string>;
type Styles<T extends string> = Record<T, StringObj>;
type State = "recently-redeemed" | "last-redeemed" | "normal";
type Mode = "normal" | "recent";

const stateStyleMap: Styles<State> = {
  // this state is active for 8 seconds before switching to "last-redeemed"
  "recently-redeemed": {
    "--background": "var(--color-primary)",
    "--text-color-normal": "var(--color-text-bg-light)",
    "--text-color-demphasized": "rgba(0, 0, 0, 0.8)",
  },
  "last-redeemed": {
    "--background": "var(--color-bg-tertiary)",
    "--text-color-normal": "var(--color-text-bg-dark)",
    "--text-color-demphasized": "rgba(255, 255, 255, 0.8)",
  },
  "normal": {
    "--background": "var(--color-bg-primary)",
    "--text-color-normal": "var(--color-text-bg-dark)",
    "--text-color-demphasized": "rgba(255, 255, 255, 0.8)",
  },
};

const modeStyleMap: Styles<Mode> = {
  "normal": {
    "--font-size-normal": "16px",
    "--font-weight-normal": "400",
    "--font-size-demphasized": "14px",
    "--font-weight-demphasized": "400",
    "--padding": "8px 24px",
    "--avatar-size": "32px",
    "--collectible-icon-size": "24px",
  },
  "recent": {
    "--font-size-normal": "18px",
    "--font-weight-normal": "600",
    "--font-size-demphasized": "16px",
    "--font-weight-demphasized": "400",
    "--padding": "20px 24px",
    "--avatar-size": "40px",
    "--collectible-icon-size": "32px",
  },
};

export default function DoSomethingAction(
  { state = "normal", mode = "normal", action }: { state?: State; mode?: Mode; action: Action },
) {
  useStyleSheet(styleSheet);

  const styles = {
    ...stateStyleMap[state],
    ...modeStyleMap[mode],
  };

  return (
    <div
      className="c-recent-action"
      style={styles}
    >
      <div className="profile">
        <Avatar user={action.user} size={styles["--avatar-size"]} />
        <div className="username">
          {action.user?.name ?? "Anonymous"}
        </div>
      </div>
      <div className="collectible">
        <div className="icon">
          <img src={action.collectible?.fileRel?.fileObj?.src} />
        </div>
        <div className="name">
          {action.collectible?.name}
        </div>
      </div>
      <div className="time-since">{timeAgo.format(new Date(action.time), "round")}</div>
    </div>
  );
}
