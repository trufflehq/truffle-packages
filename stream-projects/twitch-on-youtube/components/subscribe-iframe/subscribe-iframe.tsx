import React, { useEffect, useState } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import {
  signal,
  useSignal,
} from "https://tfl.dev/@truffle/state@~0.0.8/mod.ts";
import { useSelector } from "https://npm.tfl.dev/@legendapp/state@~0.19.0/react";

import styleSheet from "./subscribe-iframe.scss.js";

function SubscribeFrame(
  { channelName, isVisible$ }: {
    channelName: string;
    isVisible$: signal<boolean>;
  },
) {
  useStyleSheet(styleSheet);
  const isReady$ = useSignal(false);
  const isReady = useSelector(() => isReady$.get());
  const isVisible = useSelector(() => isVisible$.get());

  useEffect(() => {
    jumper.call("extension.removeRequestHeaders", {
      headers: ["X-Frame-Options"],
    })
      .then(() => {
        isReady$.set(true);
      });
  }, []);

  return (
    <>
      {isReady
        ? (
          <iframe
            className={`c-subscribe-iframe${isVisible ? " is-visible" : ""}`}
            src={`https://www.twitch.tv/subs/${channelName}?embed`}
          />
        )
        : null}
    </>
  );
}

export default SubscribeFrame;
