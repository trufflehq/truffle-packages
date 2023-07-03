import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import Giveaway from "../components/giveaway/giveaway.tsx";

function GiveawayPage() {
  return (
    <Giveaway />
  );
}

export default toDist(GiveawayPage, import.meta.url);
