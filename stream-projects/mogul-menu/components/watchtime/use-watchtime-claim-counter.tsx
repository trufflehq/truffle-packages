import {
  _,
  getCookie,
  GLOBAL_JUMPER_MESSAGES,
  jumper,
  setCookie,
  useEffect,
  useMutation,
  useObserve,
  useQuerySignal,
  useSignal,
} from "../../deps.ts";
import { MOGUL_MENU_JUMPER_MESSAGES } from "../../shared/mod.ts";
import { ECONOMY_ACTION_QUERY, WATCH_TIME_CLAIM_MUTATION } from "./gql.ts";
import useTimer from "./use-timer.tsx";

const CHANNEL_POINTS_CLAIM_TRIGGER_ID = "41760be0-6f68-11ec-b706-956d4fcf75c0";
// const XP_CLAIM_TRIGGER_ID = "fc93de80-929e-11ec-b349-c56a67a258a0";
const UPDATE_WATCH_TIME_FREQ_MS = 60 * 1000; // 1 min
// keep their state if they're gone from stream for < this amount of time
// this is a fix for if they're just refreshing, or if they're going fullscreen (component gets reloaded)
// we could reset more frequently (ie shorter amount of time here), but for now we're
// tying the cookie ttl refresh to the UPDATE_WATCH_TIME_FREQ_MS (probably good to not update cookies too often)
const ALLOWED_TIME_AWAY_MS = UPDATE_WATCH_TIME_FREQ_MS + 10 * 1000;
const LAST_CLAIM_TIME_MS_COOKIE = "extensionLastClaimTimeMs";

const DEFAULT_TIMER_MS = 60 * 5 * 1000; // 5 min

export default function useWatchtimeClaimCounter({ sourceType }: {
  sourceType: string;
}) {
  const [_watchtimeClaimResult, executeWatchtimeClaimMutation] = useMutation(
    WATCH_TIME_CLAIM_MUTATION,
  );
  const channelPointsClaimEconomyAction$ = useQuerySignal(ECONOMY_ACTION_QUERY, {
    economyTriggerId: CHANNEL_POINTS_CLAIM_TRIGGER_ID,
  });

  const lastClaimTimeMsFromCookie = getCookie(LAST_CLAIM_TIME_MS_COOKIE);
  const lastClaimTimeMs = lastClaimTimeMsFromCookie
    ? !isNaN(lastClaimTimeMsFromCookie) ? parseInt(lastClaimTimeMsFromCookie) : Date.now()
    : Date.now();

  // TODO: figure out a better way to do this... (waiting for initial data)
  const baseClaimCountdownMs$ = useSignal(DEFAULT_TIMER_MS);
  useObserve(() => {
    const channelPointsClaimEconomyAction = channelPointsClaimEconomyAction$.get()?.economyAction;
    const claimCountdownSeconds = channelPointsClaimEconomyAction?.data?.cooldownSeconds;

    if (claimCountdownSeconds) {
      const baseClaimCountdownMs = claimCountdownSeconds * 1000;
      const timeSinceLastClaimTimeMs = Date.now() - lastClaimTimeMs;
      baseClaimCountdownMs$.set(baseClaimCountdownMs);
      claimCountdownMs$.set(baseClaimCountdownMs - timeSinceLastClaimTimeMs);
    }
  });

  const claimCountdownMs$ = useSignal(DEFAULT_TIMER_MS);
  const canClaim$ = useSignal(claimCountdownMs$.get() > 0 ? false : true);

  useTimer({ timerMs$: claimCountdownMs$ });

  useEffect(() => {
    jumper.call("comms.onMessage", (message: string) => {
      if (message === MOGUL_MENU_JUMPER_MESSAGES.RESET_TIMER) {
        canClaim$.set(false);
        resetTimer();
      }
    });
  }, []);

  // every second
  useObserve(() => {
    if (claimCountdownMs$.get() <= 0 && !canClaim$.peek()) {
      canClaim$.set(true);
    }
    // set a cookie for when they started watching
    // we'll give them benefit of the doubt where they can stop watching for up to 70 seconds
    // and if they come back it'll resume their timer
    // refresh this cookie for another ALLOWED_TIME_AWAY_MS
    setCookie(LAST_CLAIM_TIME_MS_COOKIE, lastClaimTimeMs, {
      ttlMs: ALLOWED_TIME_AWAY_MS,
    });
  });

  const claim = async () => {
    resetTimer();
    canClaim$.set(false);
    setCookie(LAST_CLAIM_TIME_MS_COOKIE, Date.now(), {
      ttlMs: ALLOWED_TIME_AWAY_MS,
    });

    jumper.call("comms.postMessage", GLOBAL_JUMPER_MESSAGES.INVALIDATE_USER);
    jumper.call("comms.postMessage", MOGUL_MENU_JUMPER_MESSAGES.RESET_TIMER);
    jumper.call("comms.postMessage", MOGUL_MENU_JUMPER_MESSAGES.INVALIDATE_CHANNEL_POINTS);

    if (sourceType) {
      const economyTransactions = await executeWatchtimeClaimMutation({ sourceType }, {
        additionalTypenames: [
          "OrgUserCounter",
          "OwnedCollectible",
          "SeasonPassProgression",
          "ActivePowerup",
          "EconomyTransaction",
        ],
      });
    }
  };

  const resetTimer = () => {
    claimCountdownMs$.set(baseClaimCountdownMs$.get());
  };

  useEffect(() => {
    if (!getCookie("hasReceivedInitial")) {
      setCookie("hasReceivedInitial", "1");
      canClaim$.set(true);
    }

    if (!getCookie("hasReceivedInitialExtra")) {
      setCookie("hasReceivedInitialExtra", "1");
    }
  }, []);

  return { resetTimer, claim, claimCountdownMs$, canClaim$ };
}
