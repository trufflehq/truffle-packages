import { React } from "../../deps.ts";
import RaidBackdrop from "./backdrop/backdrop.tsx";
import RaidOverlay from "./overlay/overlay.tsx";
import { useRaidPersistence } from "./util/hooks.ts";

export default function Raid() {
  useRaidPersistence("default");
  return (
    <RaidBackdrop>
      <RaidOverlay />
    </RaidBackdrop>
  );
}
