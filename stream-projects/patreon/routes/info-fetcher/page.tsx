import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import InfoFetcher from "../../components/info-fetcher/info-fetcher.tsx";

function InfoFetcherPage() {
  return <InfoFetcher patreonUsername="theyard" />;
}

export default toDist(InfoFetcherPage, import.meta.url);
