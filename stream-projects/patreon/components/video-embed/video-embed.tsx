import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { useSignal } from "https://tfl.dev/@truffle/state@~0.0.8/mod.ts";
import { useSelector } from "https://npm.tfl.dev/@legendapp/state@~0.19.0/react";

import PatreonIframe from "../patreon-iframe/patreon-iframe.tsx";
import styleSheet from "./video-embed.scss.js";

const VISIBLE_STYLE = {
  width: "100%",
  height: "100%", // in case aspect-ratio isn't supported
  display: "block", // need to replace hidden style
  position: "absolute",
  "z-index": 99,
};

const HIDDEN_STYLE = {
  display: "none",
};

function VideoEmbed() {
  useStyleSheet(styleSheet);

  const isVisible$ = useSignal(false);
  const isVisible = useSelector(() => isVisible$.get());
  const url$ = useSignal(false);
  const url = useSelector(() => url$.get());

  useEffect(() => {
    jumper.call("comms.onMessage", (message) => {
      console.log("message received", message);

      if (message.type === "patreon.embedVideo") {
        url$.set(message.body.url);
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
          value: url ? VISIBLE_STYLE : HIDDEN_STYLE,
        },
      ],
    });
  }, [url]);

  return (
    <div
      className={`c-video-embed ${isVisible ? "is-visible" : ""} ${
        url ? "has-url" : ""
      }`}
    >
      <div className="iframe-wrapper">
        {url ? <PatreonIframe url={url} /> : null}
      </div>
      {/* TODO: close button */}
    </div>
  );
}

export default VideoEmbed;
