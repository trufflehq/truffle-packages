import React, { useEffect, useState } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { useSignal } from "https://tfl.dev/@truffle/state@~0.0.8/mod.ts";
import { useSelector } from "https://npm.tfl.dev/@legendapp/state@~0.19.0/react";

import styleSheet from "./patreon-iframe.scss.js";

function PatreonFrame({ url, isHidden }: { url: string; isHidden?: boolean }) {
  useStyleSheet(styleSheet);
  const isReady$ = useSignal(false);
  const isReady = useSelector(() => isReady$.get());

  useEffect(() => {
    isReady$.set(false);
    Promise.all([
      jumper.call("extension.setCookieSameSiteNone", {
        url: "https://www.patreon.com",
        name: "session_id",
      }),
      // without this, patreon tries to throw up a captcha
      jumper.call("extension.setCookieSameSiteNone", {
        url: "https://www.patreon.com",
        name: "datadome",
      }),
      jumper.call("extension.removeRequestHeaders", {
        headers: ["X-Frame-Options"],
      }),
    ]).then(() => {
      isReady$.set(true);
    });
  }, [url]);

  return (
    <>
      {isReady && (
        <iframe
          className={`c-patreon-iframe ${isHidden ? "is-hidden" : ""}`}
          src={url}
        />
      )}
    </>
  );
}

export default PatreonFrame;
