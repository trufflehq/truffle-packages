import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { previewSrc } from "https://tfl.dev/@truffle/raid@1.0.6/shared/util/stream-plat.ts";
import { useGoogleFontLoader } from "https://tfl.dev/@truffle/utils@~0.0.3/google-font-loader/mod.ts";

import useIsLive from "../../utils/use-is-live.ts";
import styleSheet from "./embed.scss.js";

const VISIBLE_STYLE = {
  width: "400px",
  height: "400px",
  background: "#fff",
  position: "fixed",
  bottom: 0,
  "z-index": "999",
};

const HIDDEN_STYLE = {
  display: "none",
};

function Embed() {
  useStyleSheet(styleSheet);
  useGoogleFontLoader(() => ["Roboto"]);

  const isLive = useIsLive({ sourceType: "youtubeLive" });

  useEffect(() => {
    // set styles for this iframe within YouTube's site
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        { action: "setStyle", value: isLive ? VISIBLE_STYLE : HIDDEN_STYLE },
      ],
    });
  }, [isLive]);

  console.log("isLive", isLive);
  const creatorName = "Fixme";

  return (
    <div className="c-embed">
      <div className="title">
        {creatorName} is live
      </div>
      <button className="action">
        Watch now
      </button>
      <iframe
        className="iframe"
        src={previewSrc("https://twitch.tv/stanz")}
      />
    </div>
  );
}

export default Embed;
