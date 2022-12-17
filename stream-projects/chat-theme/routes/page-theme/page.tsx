import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import PageTheme from "../../components/page-theme/page-theme.tsx";

function PageThemePage() {
  return <PageTheme alertTypes={['drlupo-stjude', 'scuffed-world-tour-theme']} />;
}

export default toDist(PageThemePage, import.meta.url);
