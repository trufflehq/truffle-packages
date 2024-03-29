import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import Embed from "../components/embed/embed.tsx";

function EmbedPage() {
  // return <Embed sourceType="youtube" sourceId="UCrPseYLGpNygVi34QpGNqpA" />;
  return <Embed sourceType="twitch" sourceName="stanz" />;
}

export default toDist(EmbedPage, import.meta.url);
