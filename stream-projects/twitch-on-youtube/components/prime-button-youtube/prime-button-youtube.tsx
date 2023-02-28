import React, { useEffect, useState } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { useGoogleFontLoader } from "https://tfl.dev/@truffle/utils@~0.0.3/google-font-loader/mod.ts";
import {
  gql,
  useMutation,
} from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";
import { useSignal } from "https://tfl.dev/@truffle/state@~0.0.8/mod.ts";
import { useSelector } from "https://npm.tfl.dev/@legendapp/state@~0.19.0/react";

import styleSheet from "./prime-button-youtube.scss.js";
import SubscribeFrame from "../subscribe-iframe/subscribe-iframe.tsx";

// TODO: this package/route could probably be consolidated with twitch live embed route

const VISIBLE_STYLE = {
  width: "100%",
  height: "104px",
  display: "block", // need to replace hidden style
  "margin-bottom": "12px",
  background: "transparent",
};

const VISIBLE_WITH_IFRAME_STYLE = {
  ...VISIBLE_STYLE,
  height: "544px",
};

const HIDDEN_STYLE = {
  display: "none",
};

const DATAPOINT_INCREMENT_UNIQUE_MUTATION = gql`
mutation DatapointIncrementUnique ($input: DatapointIncrementUniqueInput!) {
  datapointIncrementUnique(input: $input) { isUpdated }
}`;
const TEN_MINUTES_MS = 10 * 60 * 1000;

export default function PrimeButtonYoutube(
  { channelName = "stanz", creatorName = "Stanz" }: {
    channelName: string;
    creatorName: string;
  },
) {
  useStyleSheet(styleSheet);
  useGoogleFontLoader(() => ["Roboto"]);

  const [_, executeDatapointIncrementUniqueMutation] = useMutation(
    DATAPOINT_INCREMENT_UNIQUE_MUTATION,
  );

  const [canPrimeSubscribe, setCanPrimeSubscribe] = useState(false);
  const isIframeVisible$ = useSignal(false);
  const isIframeVisible = useSelector(() => isIframeVisible$.get());

  useEffect(() => {
    // this will come from the /twitch route
    jumper.call("comms.onMessage", (message) => {
      if (message?.type === "twitch.canPrimeSubscribe") {
        setCanPrimeSubscribe(true);
      }
    });
  }, []);

  useEffect(() => {
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        {
          action: "setStyle",
          value: canPrimeSubscribe && isIframeVisible
            ? VISIBLE_WITH_IFRAME_STYLE
            : canPrimeSubscribe
            ? VISIBLE_STYLE
            : HIDDEN_STYLE,
        },
      ],
    });
  }, [canPrimeSubscribe, isIframeVisible]);

  const buttonClick = () => {
    const shouldShowIframe = !isIframeVisible$.get();
    if (shouldShowIframe) {
      // remove the x-frame-options header for 10 min
      // clicking subscribe with prime will trigger a reload, which needs the header to still be gone
      jumper.call("extension.removeRequestHeaders", {
        headers: ["X-Frame-Options"],
        ttlMs: TEN_MINUTES_MS,
      });
    }
    isIframeVisible$.set(shouldShowIframe);
    executeDatapointIncrementUniqueMutation({
      input: {
        metricSlug: "unique-prime-button-clicks",
      },
    });
  };

  return (
    <>
      <div className="c-youtube">
        <div className="prompt">
          <div className="title">
            Support {creatorName} with your FREE Twitch Prime sub
          </div>
          <div
            className="button"
            onClick={buttonClick}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
            >
              <path
                d="M18.1515 11.3757L23 6.6V17.3556L22.9863 17.3395C22.8645 18.6456 21.8005 19.6667 20.506 19.6667H3.49196C2.19815 19.6667 1.13463 18.6467 1.01183 17.3417L1 17.3556V6.6L5.83629 11.3637L11.9881 5L18.1515 11.3757Z"
                fill="#9147FF"
              />
            </svg>

            Subscribe to {creatorName} for free
          </div>
        </div>
        <div className="iframe">
          <SubscribeFrame
            channelName={channelName}
            isVisible$={isIframeVisible$}
          />
        </div>
      </div>
    </>
  );
}
