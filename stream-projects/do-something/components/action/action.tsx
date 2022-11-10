import { Avatar, React, useStyleSheet } from "../../deps.ts";
import styleSheet from "./action.scss.js";

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

export default function Action(
  { state = "normal", mode = "normal" }: { state?: State; mode?: Mode },
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
        <Avatar size={styles["--avatar-size"]} />
        <div className="username">
          racoonsforsale
        </div>
      </div>
      <div className="collectible">
        <div className="icon">
          <img src="https://cdn.bio/assets/images/features/collectibles/hydrate.svg" />
        </div>
        <div className="name">
          Hydrate
        </div>
      </div>
      <div className="time-since">30sec ago</div>
    </div>
  );
}
