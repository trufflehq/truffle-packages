import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { previewSrc } from "https://tfl.dev/@truffle/raid@1.0.6/shared/util/stream-plat.ts";
import { useGoogleFontLoader } from "https://tfl.dev/@truffle/utils@~0.0.3/google-font-loader/mod.ts";

import useIsLive from "../../utils/use-is-live.ts";
import styleSheet from "./embed.scss.js";

const VISIBLE_STYLE = {
  width: "100%",
  height: "auto",
  display: "block", // need to replace hidden style
  "aspect-ratio": "16 / 9",
  "min-height": "200px", // in case aspect-ratio isn't supported
  "margin-bottom": "12px",
  background: "transparent",
};

const HIDDEN_STYLE = {
  display: "none",
};

function Embed() {
  useStyleSheet(styleSheet);
  useGoogleFontLoader(() => ["Roboto"]);

  // const isLive = useIsLive({ sourceType: "youtubeLive" });
  const isLive = useIsLive({ sourceType: "twitch", sourceName: "stanz" });

  useEffect(() => {
    // TODO: emit analytics event

    // set styles for this iframe within YouTube's site
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        { action: "setStyle", value: isLive ? VISIBLE_STYLE : HIDDEN_STYLE },
      ],
    });
  }, [isLive]);

  console.log("isLive", isLive);
  const creatorName = "Stanz";
  const url = "https://bit.ly/3IE47yU"; // twitch.tv/stanz

  return (
    <div className="c-embed">
      <a className="title" href={url} target="_blank">
        <span className="live" />
        {creatorName} is live
      </a>
      <a className="button" href={url} target="_blank">
        Watch now
      </a>
      <iframe
        className="iframe"
        frameBorder="0"
        src={`${previewSrc("https://twitch.tv/stanz")}&muted=true`}
      />
    </div>
  );
}

export default Embed;
