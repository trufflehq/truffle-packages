import { React, toDist, useEffect } from "../../deps.ts";
import Raid from "../../components/raid/raid.tsx";

function RaidOverlayPage() {
  useEffect(() => {
    console.log("getting remounted");
  }, []);
  return <Raid />;
}

export default toDist(RaidOverlayPage, import.meta.url);
