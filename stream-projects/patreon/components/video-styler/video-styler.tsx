import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";

const CSS_FOR_PATREON = `
  body {
    overflow: hidden !important;
  }

  video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99999;
  }

  video + div {
    position: fixed !important;
    z-index: 99999;
  }
`;

function VideoStyler() {
  useEffect(() => {
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        {
          action: "setStyleSheet",
          value: {
            id: "fullscreen-styles",
            css: CSS_FOR_PATREON,
          },
        },
      ],
    });
    jumper.call("comms.postMessage", {
      type: "patreon.videoReady",
    });
  }, []);

  return <></>;
}

export default VideoStyler;
