import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import VideoEmbed from "../../components/video-embed/video-embed.tsx";

const TIERS = [
  {
    id: "7158347",
    name: "shill",
    priceCents: 500,
    bullets: [
      "Premium episodes",
      "Access to The Yard Discord",
    ],
  },
  {
    id: "7158348",
    name: "rich king",
    priceCents: 1500,
    bullets: [
      "shill benefits",
      "Secret shows",
      "Behind the scenes content",
    ],
  },
  {
    id: "7158349",
    name: "shillionaire",
    priceCents: 2500,
    bullets: [
      "shill and rich king benefits",
      "WE WILL ACTUALLY MAIL TO YOUR HOUSE: a custom postcard every month with a trinket chosen at random, or a shirtless polaroid",
      "Discounts and early access to merch",
    ],
  },
];

function VideoEmbedPage() {
  return (
    <>
      <VideoEmbed
        creatorName="The Yard"
        patreonUsername="theyard"
        vimeoUrl="https://player.vimeo.com/video/815471214?h=3100be5ed0"
        tiers={TIERS}
        logoUrl="https://cdn.bio/assets/images/creators/ludwig/yard.jpg"
      />
    </>
  );
}

export default toDist(VideoEmbedPage, import.meta.url);
