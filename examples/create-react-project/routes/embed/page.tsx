import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import Embed from "../../components/embed/embed.tsx";

// run this code in dev console on a youtube stream to have your embed show locally for you
// this will add your embed to the <body> element on youtube pages
// localStorage.setItem( 'truffle:devExtensionMappings', JSON.stringify([{ "id": "localhost", "defaultLayoutConfigSteps": [ { "action": "querySelector", "value": "body" }, { "action": "appendSubject" } ], "domAction": "append", "iframeUrl": "http://localhost:8000/embed", "orgId": "8e35b570-6c2f-11ec-bade-b32a8d305590", "slug": "anything" }]) )

function EmbedPage() {
  return <Embed />;
}

export default toDist(EmbedPage, import.meta.url);
