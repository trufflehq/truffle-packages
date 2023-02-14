import React, { useEffect, useState } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import styleSheet from "./patreon-iframe.scss.js";

function PatreonFrame({ patreonUsername }: { patreonUsername: string }) {
  useStyleSheet(styleSheet);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    jumper.call("extension.setCookieSameSiteNone", {
      url: "https://www.patreon.com",
      name: "session_id",
    })
      .then(() =>
        jumper.call("extension.removeRequestHeaders", {
          headers: ["X-Frame-Options"],
        })
      )
      .then(() => {
        setIsReady(true);
      });
  }, []);

  return (
    <>
      {isReady && (
        <iframe
          className={`c-patreon-iframe`}
          src={`https://www.patreon.com/${patreonUsername}/membership?embed`}
        />
      )}
    </>
  );
}

export default PatreonFrame;
