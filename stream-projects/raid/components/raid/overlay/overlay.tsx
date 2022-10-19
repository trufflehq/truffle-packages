import {
  Icon,
  React,
  useSelector,
  useEffect,
  useStyleSheet,
} from "../../../deps.ts";
import styleSheet from "./overlay.scss.js";
import { hideRaid } from "../util/manager.ts";
import Button from "../../button/button.tsx";
import { raidState$ } from "../util/state.ts";
import { BOXED_UP_RIGHT_ARROW_ICON } from "../../../shared/assets/icons.ts";
import { useRaidData, useRaidPersistence } from "../util/hooks.ts";

export default function RaidOverlay() {
  useStyleSheet(styleSheet);

  const { id, title, description, previewSrc, url } = useRaidData();
  const isShowing = useSelector(() => raidState$.isShowing.get());
  useRaidPersistence(id);

  useEffect(() => {
    console.log("isShowing from useSelector:", isShowing);
  }, [isShowing]);

  return (
    <div className="c-raid-overlay">
      {previewSrc && isShowing && (
        <div className="iframe-container">
          <iframe
            src={previewSrc}
            frameBorder={0}
            allowFullScreen={true}
            title="creator-frame"
            allow="autoplay"
          />
        </div>
      )}
      <div className="body-container">
        <div className="raid-title">{title ?? "Raid"}</div>
        <div className="description">{description}</div>
        <div className="button-container">
          <Button style="secondary" onClick={() => hideRaid(id)}>
            Close
          </Button>
          <Button style="primary" href={url}>
            <span>Go</span>
            <Icon icon={BOXED_UP_RIGHT_ARROW_ICON} color="#FFFFFF" />
          </Button>
        </div>
      </div>
    </div>
  );
}
