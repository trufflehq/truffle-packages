import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import HiddenExtensionMapping from "../../components/hidden-extension-mapping/hidden-extension-mapping.tsx";

function HiddenExtensionMappingPage() {
  return <HiddenExtensionMapping />;
}

export default toDist(HiddenExtensionMappingPage, import.meta.url);
