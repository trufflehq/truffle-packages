import React, { useEffect } from "https://npm.tfl.dev/react";
import SpotifyComponent from "../../components/spotify-component/spotify-component.tsx";
import { toDist } from "https://tfl.dev/@truffle/distribute@1.0.0/format/wc/index.js";

function Home() {
  return <SpotifyComponent />
}

export default toDist("react", Home, import.meta.url);
