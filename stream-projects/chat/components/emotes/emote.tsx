import { React } from "../../deps.ts";
import { Emote, EMOTE_PROVIDER_NAME, getEmoteUrl } from "../../shared/mod.ts";
import TooltipWrapper, { TooltipAlignment } from "../tooltip/tooltip-wrapper.tsx";

function EmoteToolTipInfo({ emote }: { emote: Emote }) {
  return (
    <div className="emote-tool-tip-info">
      <div>{emote.name}</div>
      <div>{EMOTE_PROVIDER_NAME[emote.provider]}</div>
    </div>
  );
}

export default function EmoteRenderer(
  { emote, tooltipAlign = "center" }: { emote: Emote; tooltipAlign?: TooltipAlignment },
) {
  return (
    <TooltipWrapper tooltip={<EmoteToolTipInfo emote={emote} />} align={tooltipAlign}>
      <img className="truffle-emote" src={getEmoteUrl(emote)} />
    </TooltipWrapper>
  );
}
