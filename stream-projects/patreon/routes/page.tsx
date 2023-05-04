import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import PremiumContentEmbed from "../components/premium-content-embed/premium-content-embed.tsx";

function EmbedPage() {
  return (
    <PremiumContentEmbed
      patreonUsername="theyard"
      creatorName="Wine About It"
      channelId="c5e1ab20-d7ca-11ed-ae82-f9fec1944503"
    />
  );
}

export default toDist(EmbedPage, import.meta.url);
