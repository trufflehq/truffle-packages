import { formatCountdown, React, signal, useSelector, useStyleSheet } from "../../deps.ts";
import styleSheet from "./watchtime.scss.js";
import { getCreatorName, useMenu } from "../menu/mod.ts";
import Button from "../../components/base/button/button.tsx";
import useWatchtimeClaimCounter from "./use-watchtime-claim-counter.tsx";
import useWatchtimePassiveCounter from "./use-watchtime-passive-counter.tsx";

// const POINTS_QUERY = gql`
//   query {
//     seasonPass {
//       xp: orgUserCounter {
//         count
//       }
//     }

//     channelPoints: orgUserCounterType(input: { slug: "channel-points" }) {
//       orgUserCounter {
//         count
//       }
//     }
//   }
// `;

interface WatchtimeProps {
  highlightButtonBg?: string;
  hasChannelPoints: boolean;
  hasBattlePass: boolean;
}

export default function Watchtime(props: WatchtimeProps) {
  useStyleSheet(styleSheet);
  const { state: menuState } = useMenu();
  const creatorName = getCreatorName(menuState);
  const {
    highlightButtonBg,
    hasChannelPoints,
    hasBattlePass,
  } = props;

  const { claim, claimCountdownMs$, canClaim$ } = useWatchtimeClaimCounter({
    sourceType: "youtube",
  });
  const { timeWatchedMs$ } = useWatchtimePassiveCounter({ sourceType: "youtube" });

  const canClaim = useSelector(() => canClaim$.get());

  return (
    <div className="c-live-info">
      <div
        className="header"
        style={{
          "--background": highlightButtonBg ?? "var(--mm-gradient)",
        }}
      >
        {creatorName ? `${creatorName} is live!` : ""}
      </div>
      <div className="info">
        <div className="message">
          {creatorName
            ? hasChannelPoints && hasBattlePass
              ? `Earn channel points and XP by watching ${creatorName} during the stream`
              : hasChannelPoints
              ? `Earn channel points by watching ${creatorName} during the stream`
              : hasBattlePass
              ? `Earn XP by watching ${creatorName} during the stream`
              : "Channel Points and XP not currently enabled"
            : "Channel Points and XP not currently enabled"}
        </div>
        <div className="grid">
          <TimerDisplay timerMs$={timeWatchedMs$} title="Time watched" />
          <Button isDisabled={!canClaim} className="claim" style="gradient" onClick={claim}>
            {canClaim
              ? "Claim Reward"
              : <TimerDisplay timerMs$={claimCountdownMs$} title="Claim reward in" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function TimerDisplay({ timerMs$, title }: { timerMs$: signal<number>; title: string }) {
  const timerMs = useSelector(() => timerMs$.get());

  return (
    <div className="timer">
      <div className="title">
        {title}
      </div>
      <div className="time">
        {formatCountdown(timerMs / 1000, { shouldAlwaysShowHours: false })}
      </div>
    </div>
  );
}
