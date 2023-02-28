import React, { useEffect, useRef } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { useGoogleFontLoader } from "https://tfl.dev/@truffle/utils@~0.0.3/google-font-loader/mod.ts";
import { useSignal } from "https://tfl.dev/@truffle/state@~0.0.8/mod.ts";
import { useSelector } from "https://npm.tfl.dev/@legendapp/state@~0.19.0/react";
import Icon from "https://tfl.dev/@truffle/ui@~0.2.0/components/legacy/icon/icon.tsx";

import PatreonIframe from "../patreon-iframe/patreon-iframe.tsx";
import styleSheet from "./video-embed.scss.js";
import type { VideoInfo } from "../../types/index.ts";

const VISIBLE_STYLE = {
  width: "100%",
  height: "calc(100% + 40px)", // space for full-size patreon video + info bar
  display: "block", // need to replace hidden style
  position: "absolute",
  top: 0,
  left: 0,
  "z-index": 99,
};

const HIDDEN_STYLE = {
  display: "none",
};

const CLOSE_ICON_PATH =
  "M19,6.41 L17.59,5 L12,10.59 L6.41,5 L5,6.41 L10.59,12 L5,17.59 L6.41,19 L12,13.41 L17.59,19 L19,17.59 L13.41,12 L19,6.41 Z";
const PATREON_ICON_PATH =
  "M4.23146 0.421875V23.5172H0V0.421875H4.23146ZM15.3429 0.421875C20.1241 0.421875 24 4.29781 24 9.07902C24 13.8602 20.1241 17.7362 15.3429 17.7362C10.5616 17.7362 6.68571 13.8602 6.68571 9.07902C6.68571 4.29781 10.5616 0.421875 15.3429 0.421875Z";
const OPEN_IN_NEW_ICON_PATH =
  "M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z";

function VideoEmbed() {
  useStyleSheet(styleSheet);
  useGoogleFontLoader(() => ["Roboto"]);

  const isVisible$ = useSignal(false);
  const isVisible = useSelector(() => isVisible$.get());
  const videoInfo$ = useSignal<VideoInfo | undefined>();
  const videoInfo = useSelector(() => videoInfo$.get());

  console.log("vi", videoInfo);

  useEffect(() => {
    jumper.call("comms.onMessage", (message) => {
      console.log("message received", message);

      if (message.type === "patreon.embedVideo") {
        videoInfo$.set(message.body.videoInfo);
      } else if (message.type === "patreon.videoReady") {
        isVisible$.set(true);
      }
    });
  }, []);

  useEffect(() => {
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        {
          action: "setStyle",
          value: videoInfo ? VISIBLE_STYLE : HIDDEN_STYLE,
        },
      ],
    });
  }, [videoInfo?.url]);

  const close = () => {
    isVisible$.set(false);
    videoInfo$.set(null);
  };

  if (!videoInfo) {
    return <></>;
  }

  return (
    <div
      className={`c-video-embed 
        ${isVisible ? "is-visible" : ""}
        ${videoInfo ? "has-video" : ""}`}
    >
      <div className="info-bar">
        <div className="icon">
          <Icon
            icon={PATREON_ICON_PATH}
            size="24px"
            color="#FF424D"
          />
        </div>
        <div className="title">
          {videoInfo?.title || ""}
        </div>
        <a href={videoInfo?.url} target="_blank" className="button">
          <Icon
            icon={OPEN_IN_NEW_ICON_PATH}
            size="16px"
            color="#FF424D"
          />
          Watch on Patreon
        </a>
        <div className="close">
          <Icon
            icon={CLOSE_ICON_PATH}
            size="24px"
            color="#fff"
            onclick={close}
          />
        </div>
      </div>
      <div className="iframe-wrapper">
        {videoInfo ? <PatreonIframe url={`${videoInfo.url}?embed`} /> : null}
      </div>
      <div className="loading">Loading Patreon video</div>
    </div>
  );
}

export default VideoEmbed;
