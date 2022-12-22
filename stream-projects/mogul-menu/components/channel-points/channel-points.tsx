import {
  abbreviateNumber,
  formatCountdown,
  formatNumber,
  GLOBAL_JUMPER_MESSAGES,
  jumper,
  React,
  useEffect,
  useRef,
  useSelector,
  useStyleSheet,
} from "../../deps.ts";
import ThemeComponent from "../../components/base/theme-component/theme-component.tsx";
import useWatchtimeClaimCounter from "../watchtime/use-watchtime-claim-counter.tsx";
import { MOGUL_MENU_JUMPER_MESSAGES, useOrgUserConnectionsQuery } from "../../shared/mod.ts";
import { useChannelPoints } from "./hooks.ts";
import ChannelPointsIcon from "../channel-points-icon/channel-points-icon.tsx";
import stylesheet from "./channel-points.scss.js";
import IsLive from "../is-live/is-live.tsx";

const CHANNEL_POINTS_STYLES = {
  width: "140px",
  height: "30px",
  background: "transparent",
  "z-index": "999",
  "color-scheme": "only light",
};

export default function ChannelPoints(
  { highlightButtonBg, isStandalone = true, style = "collapsed" }: {
    highlightButtonBg?: string;
    isStandalone?: boolean;
    style?: "collapsed" | "expanded";
  },
) {
  useStyleSheet(stylesheet);
  const { refetchOrgUserConnections } = useOrgUserConnectionsQuery();
  const { channelPointsData, channelPointsError, reexecuteChannelPointsQuery } = useChannelPoints();

  const rawChannelPointsRef = useRef<number | undefined>();
  const rawChannelPoints = channelPointsData?.orgUserCounterType?.orgUserCounter?.count;
  // if we have brief period of downtime, we want to keep the previous value here
  // instead of having it show '..' or 0, so less people freak out.
  // as long as a value was returned, or there wasn't an error, we can use the value
  if (channelPointsData && (rawChannelPoints != null || !channelPointsError)) {
    rawChannelPointsRef.current = rawChannelPoints ?? 0;
  }

  useEffect(() => {
    jumper.call("comms.onMessage", (message: string) => {
      if (message === GLOBAL_JUMPER_MESSAGES.INVALIDATE_USER) {
        refetchOrgUserConnections({ requestPolicy: "network-only" });
      } else if (message === MOGUL_MENU_JUMPER_MESSAGES.INVALIDATE_CHANNEL_POINTS) {
        reexecuteChannelPointsQuery({ requestPolicy: "network-only" });
      } else if (message === MOGUL_MENU_JUMPER_MESSAGES.RESET_TIMER) {
        // claim recorded elsewhere (menu watchtime.tsx), reset the timer
        resetTimer();
      }
    });

    if (isStandalone) {
      // set styles for this iframe within YouTube's site
      jumper.call("layout.applyLayoutConfigSteps", {
        layoutConfigSteps: [
          { action: "useSubject" }, // start with our iframe
          { action: "setStyle", value: CHANNEL_POINTS_STYLES },
        ],
      });
    }
  }, []);

  const fullChannelPoints = rawChannelPointsRef.current != null
    ? formatNumber(rawChannelPointsRef.current)
    : "...";
  const channelPoints = rawChannelPointsRef.current != null
    ? abbreviateNumber(rawChannelPointsRef.current, 2)
    : "..";

  const { canClaim$, claimCountdownMs$, claim, resetTimer } = useWatchtimeClaimCounter({
    sourceType: "youtube",
  });
  const canClaim = useSelector(() => canClaim$.get());
  const claimCountdownMs = useSelector(() => claimCountdownMs$.get());

  const title = canClaim
    ? ""
    : formatCountdown(claimCountdownMs / 1000, { shouldAlwaysShowHours: false });

  return (
    <div className={`c-channel-points ${style}`} title={title}>
      <ThemeComponent />
      <div className="inner">
        <div className="coin">
          <ChannelPointsIcon />
        </div>
        {
          <div className="points" title={fullChannelPoints}>
            {channelPoints}
          </div>
        }
        <IsLive sourceType="youtubeLive">
          {canClaim &&
            (
              <div
                className="claim"
                style={{
                  background: highlightButtonBg,
                }}
                onClick={claim}
              >
                <ChannelPointsIcon size={16} variant="dark" />
                {style === "expanded" && <span className="title">Claim</span>}
              </div>
            )}
        </IsLive>
      </div>
    </div>
  );
}
