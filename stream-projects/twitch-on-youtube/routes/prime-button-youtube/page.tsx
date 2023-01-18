import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import PrimeButtonYoutube from "../components/prime-button-youtube/prime-button-youtube.tsx";

function PrimeButtonYoutubePage() {
  return <PrimeButtonYoutube channelName="stanz" />;
}

export default toDist(PrimeButtonYoutubePage, import.meta.url);
