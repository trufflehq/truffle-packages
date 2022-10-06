import { React, toDist } from "../../deps.ts";
import Raid from "../../components/raid/raid.tsx";

function RaidOverlayPage() {
  return <Raid />;
}

export default toDist(RaidOverlayPage, import.meta.url);
