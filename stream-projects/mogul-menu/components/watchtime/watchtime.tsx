import {
  GLOBAL_JUMPER_MESSAGES,
  gql,
  jumper,
  React,
  useCallback,
  useEffect,
  useObservables,
  useQuery,
  useState,
  useStyleSheet,
} from "../../deps.ts";
import styleSheet from "./watchtime.scss.js";
import { getCreatorName, useMenu } from "../menu/mod.ts";
import Button from "../../components/base/button/button.tsx";
import { MOGUL_MENU_JUMPER_MESSAGES } from "../../shared/mod.ts";
import Timer from "../timer/timer.tsx";
import { useWatchtimeCounter } from "./watchtime-counter.ts";

const POINTS_QUERY = gql`
  query {
    seasonPass {
      xp: orgUserCounter {
        count
      }
    }

    channelPoints: orgUserCounterType(input: { slug: "channel-points" }) {
      orgUserCounter {
        count
      }
    }
  }
`;

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
  const [isClaimable, setIsClaimable] = useState(false);

  const [
    { data: pointsData, fetching: isFetchingPoints },
    reexecutePointsQuery,
  ] = useQuery({
    query: POINTS_QUERY,
  });

  const onFinishedCountdown = useCallback(async () => {
    await reexecutePointsQuery({
      requestPolicy: "network-only",
      additionalTypenames: [
        "OrgUserCounter",
        "OwnedCollectible",
        "SeasonPassProgression",
        "ActivePowerup",
        "EconomyTransaction",
      ],
    });
    jumper.call("comms.postMessage", MOGUL_MENU_JUMPER_MESSAGES.INVALIDATE_CHANNEL_POINTS);
    setIsClaimable(true);
  }, []);

  useEffect(() => {
    jumper.call("comms.onMessage", (message: string) => {
      if (message === MOGUL_MENU_JUMPER_MESSAGES.RESET_TIMER) {
        setIsClaimable(false);
        resetTimer();
      }
    });
  }, []);

  const { resetTimer, secondsRemainingSubject, timeWatchedSecondsSubject, claim } =
    useWatchtimeCounter({
      source: "youtube",
      onFinishedCountdown,
      isClaimable,
      setIsClaimable,
    });

  const { secondsRemaining, timeWatchedSeconds } = useObservables(() => ({
    timeWatchedSeconds: timeWatchedSecondsSubject.obs,
    secondsRemaining: secondsRemainingSubject.obs,
  }));

  const onClaim = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsClaimable(false);

    await claim();

    // invalidate the user and let the channel points component know to invalidate its state
    jumper.call("comms.postMessage", GLOBAL_JUMPER_MESSAGES.INVALIDATE_USER);
    jumper.call("comms.postMessage", MOGUL_MENU_JUMPER_MESSAGES.RESET_TIMER);
    jumper.call("comms.postMessage", MOGUL_MENU_JUMPER_MESSAGES.INVALIDATE_CHANNEL_POINTS);
  };

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
          {(hasChannelPoints || hasBattlePass || true) && (
            <Timer timerSeconds={timeWatchedSeconds} message={"Time watched"} />
          )}
          {
            <Button isDisabled={!isClaimable} className="claim" style="gradient" onClick={onClaim}>
              {isClaimable ? "Claim Reward" : (
                <Timer
                  timerSeconds={secondsRemaining}
                  message={"Claim reward in"}
                />
              )}
            </Button>
          }
        </div>
      </div>
    </div>
  );
}
