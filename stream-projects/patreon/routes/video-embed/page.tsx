import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import VideoEmbed from "../../components/video-embed/video-embed.tsx";

function VideoEmbedPage() {
  return <VideoEmbed />;
}

export default toDist(VideoEmbedPage, import.meta.url);
