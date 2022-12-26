import { React } from "../../deps.ts";
import RaidBackdrop from "./backdrop/backdrop.tsx";
import RaidOverlay from "./overlay/overlay.tsx";
import { useGoogleFontLoader } from "../../shared/util/hooks.ts";

export default function Raid() {
  const fonts = ["Inter"];
  useGoogleFontLoader(() => fonts, fonts);

  return (
    <RaidBackdrop>
      <RaidOverlay />
    </RaidBackdrop>
  );
}
