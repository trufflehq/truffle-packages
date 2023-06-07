import { React } from "../../deps.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP
import ChannelPoints from "../../components/channel-points/channel-points.tsx";

function HomePage() {
  return (
    <>
      <ChannelPoints highlightButtonBg="var(--mm-gradient)" />
    </>
  );
}

export default toDist(HomePage, import.meta.url);
