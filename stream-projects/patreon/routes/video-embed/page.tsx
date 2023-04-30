import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import VideoEmbed from "../../components/video-embed/video-embed.tsx";

const TIERS = [
  {
    id: "9602021",
    name: "buzzed",
    priceCents: 500,
    bullets: [
      "Premium episodes",
      "Early merch access",
      "Patreon Exclusive Pet Photo Dumps",
    ],
  },
  {
    id: "9602075",
    name: "tipsy",
    priceCents: 1500,
    bullets: [
      "buzzed benefits",
      "QT/Maya Trash TV Reacts",
      "QT Explains a Taylor Swift Song",
      "Maya's Weird Animal Spotlight",
    ],
  },
  {
    id: "9602085",
    name: "drunk",
    priceCents: 3000,
    bullets: [
      "buzzed and tipsy benefits",
      "Monthly stickers",
      "Monthly QT Recipe Card",
      "Monthly Maya Art Print",
    ],
  },
];

function VideoEmbedPage() {
  return (
    <>
      <VideoEmbed
        creatorName="Wine About It"
        patreonUsername="wineaboutit"
        vimeoUrl="https://player.vimeo.com/video/816373271?h=3ef8457d93"
        tiers={TIERS}
        logoUrl="https://cdn.bio/assets/images/creators/qt/wineaboutit.png"
      />
    </>
  );
}

export default toDist(VideoEmbedPage, import.meta.url);
