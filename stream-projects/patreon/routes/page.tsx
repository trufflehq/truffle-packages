import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import PremiumContentEmbed from "../components/premium-content-embed/premium-content-embed.tsx";

function EmbedPage() {
  return (
    <PremiumContentEmbed
      patreonUsername="theyard"
      creatorName="The Yard"
      channelId="79282f80-d4d6-11ed-80ab-8d6927988a61"
    />
  );
}

export default toDist(EmbedPage, import.meta.url);
