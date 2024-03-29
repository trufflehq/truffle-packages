import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import VideoStyler from "../../components/video-styler/video-styler.tsx";

function VideoStylerPage() {
  return <VideoStyler />;
}

export default toDist(VideoStylerPage, import.meta.url);
