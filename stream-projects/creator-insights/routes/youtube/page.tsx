import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import "../../components/youtube/youtube.tsx";

function YoutubePage() {
  // TODO: clean up. this doesn't need to be react...
  return <></>;
  // return <Youtube />;
}

export default toDist(YoutubePage, import.meta.url);
