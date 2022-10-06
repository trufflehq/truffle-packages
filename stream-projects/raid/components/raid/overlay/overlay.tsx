import { Icon, React, useStyleSheet } from "../../../deps.ts";
import styleSheet from "./overlay.scss.js";
import { hideRaid } from "../util/manager.ts";
import Button from "../../button/button.tsx";

import { BOXED_UP_RIGHT_ARROW_ICON } from "../../../shared/assets/icons.ts";

export default function RaidOverlay() {
  useStyleSheet(styleSheet);
  const combinedIsMinimizedRaid = false;
  const hasSeenRaid = false;
  const previewSrc = "https://www.youtube.com/watch?v=tRYyML2tXn8";
  const raidData = {
    title: "Go raid Tim",
    description: "Do it",
  };

  return (
    <div className="c-raid-overlay">
      {!combinedIsMinimizedRaid && !hasSeenRaid && previewSrc && (
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
        <div className="raid-title">
          {previewSrc || raidData?.title ? raidData?.title : "Raid"}
        </div>
        <div className="description">{raidData?.description}</div>
        <div className="button-container">
          <Button style="secondary" onClick={hideRaid.bind(null, "default")}>
            Close
          </Button>
          {/* <Component
              slug="button"
              props={{
                text: "Go",
                href: raidUrl,
                // TODO: use our link trackers instead of this
                onMouseDown: () => {
                  globalThis?.window?.ga?.(
                    "send",
                    "event",
                    "raid",
                    "click",
                    raidData?.url
                  );
                },
                icon: BOXED_UP_RIGHT_ARROW_ICON,
                iconLocation: "right",
                iconColor: "white",
              }}
            /> */}
          <Button style="primary">
            <span>Go</span>
            <Icon icon={BOXED_UP_RIGHT_ARROW_ICON} color="#FFFFFF" />
          </Button>
        </div>
      </div>
    </div>
  );
}
