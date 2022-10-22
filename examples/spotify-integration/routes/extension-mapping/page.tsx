import React, { useEffect } from "https://npm.tfl.dev/react";
import SpotifyComponent from "../../components/spotify-component/spotify-component.tsx";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

function Home() {
  return <SpotifyComponent />;
}

export default toDist(Home, import.meta.url);
