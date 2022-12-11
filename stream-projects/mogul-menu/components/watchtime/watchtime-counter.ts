import {
  _,
  createSubject,
  getCookie,
  gql,
  Obs,
  op,
  queryObservable,
  setCookie,
  useEffect,
  useMemo,
  useMutation,
  useObservables,
  useRef,
} from "../../deps.ts";

import { ECONOMY_ACTION_QUERY } from "./gql.ts";

const WATCH_TIME_INCREMENT_MUTATION = gql`
  mutation ($secondsWatched: Int, $sourceType: String) {
    watchTimeIncrement(
      input: { secondsWatched: $secondsWatched, sourceType: $sourceType }
    ) {
      isUpdated
    }
  }
`;

const WATCH_TIME_CLAIM_MUTATION = gql`
  mutation ($sourceType: String!) {
    watchTimeClaim(input: { sourceType: $sourceType }) {
      economyTransactions {
        amountId
        amountValue
      }
    }
  }
`;

const CHANNEL_POINTS_CLAIM_TRIGGER_ID = "41760be0-6f68-11ec-b706-956d4fcf75c0";
const XP_CLAIM_TRIGGER_ID = "fc93de80-929e-11ec-b349-c56a67a258a0";
const TIMER_INCREMENT_MS = 1000;
const MS_TO_SECONDS = 1000;
const UPDATE_WATCH_TIME_FREQ_SECONDS = 60;
// keep their state if they're gone from stream for < this amount of time
// this is a fix for if they're just refreshing, or if they're going fullscreen (component gets reloaded)
// we could reset more frequently (ie shorter amount of time here), but for now we're
// tying the cookie ttl refresh to the UPDATE_WATCH_TIME_FREQ_SECONDS (probably good to not update cookies too often)
const ALLOWED_TIME_AWAY_MS = 1000 * (UPDATE_WATCH_TIME_FREQ_SECONDS + 10);
const INITIAL_TIME_MS_COOKIE = "extensionInitialTimeMs";
const LAST_CLAIM_TIME_MS_COOKIE = "extensionLastClaimTimeMs";

const DEFAULT_TIMER_SECONDS = 60 * 5;
const DEFAULT_INTERVAL_SECONDS = 1;
function secondsSinceByMilliseconds(minuend: number, subtrahend: number) {
  return Math.round((minuend - subtrahend) / MS_TO_SECONDS);
}

function secondsSinceBySeconds(minuend: number, subtrahend: number) {
  return Math.round(minuend - subtrahend);
}

export function useWatchtimeCounter({
  onFinishedCountdown,
  source,
  isClaimable,
  setIsClaimable
}: {
  onFinishedCountdown?: () => void;
  source: string;
  isClaimable: boolean
  setIsClaimable: (isClaimable: boolean) => void
}) {
  const [_incrementWatchtimeResult, executeIncrementWatchtimeMutation] = useMutation(
    WATCH_TIME_INCREMENT_MUTATION,
  );

  const [_watchtimeClaimResult, executeWatchtimeClaimMutation] = useMutation(
    WATCH_TIME_CLAIM_MUTATION,
  );

  const intervalRef = useRef(null);
  const lastUpdateTimeRef = useRef(null);
  const initialTimeRef = useRef(null);
  const decrementStartTimeRef = useRef(null);
  const lootTimerRef = useRef(null);
  const messageTimerRef = useRef(null);

  const {
    watchTimeSubject,
    initialTimeSubject,
    lastUpdateTimeSubject,
    decrementStartTimeSubject,
    isClaimButtonVisibleSubject,
    claimChannelPointEconomyActionAmountObs,
    claimXpEconomyActionAmountObs,
    claimTimerCountdownSecondsObs,
    claimXpEconomyActionObs,
    claimChannelPointEconomyActionObs,
    timeWatchedSecondsSubject,
    secondsRemainingSubject,
  } = useMemo(() => {
    const claimChannelPointEconomyActionObs = queryObservable(
      ECONOMY_ACTION_QUERY,
      { economyTriggerId: CHANNEL_POINTS_CLAIM_TRIGGER_ID },
    ).pipe(op.map((result) => {
      return result?.data?.economyAction;
    }));

    const claimXpEconomyActionObs = queryObservable(ECONOMY_ACTION_QUERY, {
      economyTriggerId: XP_CLAIM_TRIGGER_ID,
    }).pipe(op.map((result) => result?.data?.economyAction));

    const initialTimeMsFromCookie = getCookie(INITIAL_TIME_MS_COOKIE);
    const initialTimeMs = initialTimeMsFromCookie ? parseInt(initialTimeMsFromCookie) : Date.now();
    const lastClaimTimeMsFromCookie = getCookie(LAST_CLAIM_TIME_MS_COOKIE);
    const decrementTimeMs = lastClaimTimeMsFromCookie
      ? !isNaN(lastClaimTimeMsFromCookie) ? parseInt(lastClaimTimeMsFromCookie) : Date.now()
      : Date.now();

    // set a cookie for when they started watching
    // we'll give them benefit of the doubt where they can stop watching for up to 70 seconds
    // and if they come back it'll resume their timer
    // refresh this cookie for another ALLOWED_TIME_AWAY_MS
    setCookie(INITIAL_TIME_MS_COOKIE, initialTimeMs, {
      ttlMs: ALLOWED_TIME_AWAY_MS,
    });
    // set initial
    setCookie(LAST_CLAIM_TIME_MS_COOKIE, decrementTimeMs, {
      ttlMs: ALLOWED_TIME_AWAY_MS,
    });

    const claimXpEconomyActionAndClaimChannelPointActionObs = Obs.combineLatest(
      claimXpEconomyActionObs,
      claimChannelPointEconomyActionObs,
    );

    return {
      timeWatchedSecondsSubject: createSubject(),
      secondsRemainingSubject: createSubject(),
      watchTimeSubject: createSubject(null),
      initialTimeSubject: createSubject(initialTimeMs),
      lastUpdateTimeSubject: createSubject(Date.now()),
      decrementStartTimeSubject: createSubject(decrementTimeMs),
      isClaimButtonVisibleSubject: createSubject(false),
      claimChannelPointEconomyActionObs,
      claimChannelPointEconomyActionAmountObs: claimChannelPointEconomyActionObs.pipe(
        op.map((economyAction) => economyAction?.amountValue),
      ),
      claimXpEconomyActionObs,
      claimXpEconomyActionAmountObs: claimXpEconomyActionObs.pipe(
        op.map((economyAction) => economyAction?.amountValue),
      ),
      claimTimerCountdownSecondsObs: claimXpEconomyActionAndClaimChannelPointActionObs.pipe(
        op.map(([claimXpEconomyAction, claimChannelPointEconomyAction]) => {
          const cooldownSeconds = claimChannelPointEconomyAction?.data?.cooldownSeconds ||
            claimXpEconomyAction?.data?.cooldownSeconds;
          if (cooldownSeconds) {
            return Math.max(cooldownSeconds, DEFAULT_INTERVAL_SECONDS);
          } else {
            return DEFAULT_TIMER_SECONDS;
          }
        }),
      ),
    };
  }, []);

  const {
    initialTime,
    lastUpdateTime,
    decrementStartTime,
    isClaimButtonVisible,
    claimChannelPointEconomyActionAmount,
    claimXpEconomyActionAmount,
    claimTimerCountdownSeconds,
    claimXpEconomyAction,
    claimChannelPointEconomyAction,
  } = useObservables(() => ({
    initialTime: initialTimeSubject.obs,
    lastUpdateTime: lastUpdateTimeSubject.obs,
    decrementStartTime: decrementStartTimeSubject.obs,
    isClaimButtonVisible: isClaimButtonVisibleSubject.obs,
    claimChannelPointEconomyActionAmount: claimChannelPointEconomyActionAmountObs,
    claimXpEconomyActionAmount: claimXpEconomyActionAmountObs,
    claimTimerCountdownSeconds: claimTimerCountdownSecondsObs,
    claimXpEconomyAction: claimXpEconomyActionObs,
    claimChannelPointEconomyAction: claimChannelPointEconomyActionObs,
  }));

  const incrementTimer = async () => {
    const updatedTime = Date.now();

    const secondsElapsedSinceLastUpdate = secondsSinceByMilliseconds(
      updatedTime,
      lastUpdateTimeRef.current,
    );

    const secondsSinceInitialLoad = secondsSinceByMilliseconds(
      updatedTime,
      initialTimeRef.current,
    );
    timeWatchedSecondsSubject.next(secondsSinceInitialLoad);

    // update the server every 60s to keep track of watch time progress
    const shouldUpdateWatchTime = secondsElapsedSinceLastUpdate >= UPDATE_WATCH_TIME_FREQ_SECONDS;

    if (shouldUpdateWatchTime) {
      // refresh this cookie for another ALLOWED_TIME_AWAY_MS
      setCookie(INITIAL_TIME_MS_COOKIE, initialTimeRef.current, {
        ttlMs: ALLOWED_TIME_AWAY_MS,
      });
      // refresh last claim time cookie
      setCookie(
        LAST_CLAIM_TIME_MS_COOKIE,
        getCookie(LAST_CLAIM_TIME_MS_COOKIE),
        { ttlMs: ALLOWED_TIME_AWAY_MS },
      );
      lastUpdateTimeSubject.next(Date.now());
      const secondsWatched = secondsElapsedSinceLastUpdate;

      if (source) {
        await executeIncrementWatchtimeMutation({
          secondsWatched,
          sourceType: source,
        }, {
          additionalTypenames: [
            "OrgUserCounter",
            "OwnedCollectible",
            "SeasonPassProgression",
            "ActivePowerup",
            "EconomyTransaction",
          ],
        });
      }
    }

    watchTimeSubject.next(updatedTime);
  };

  const decrementTimer = () => {
    const currentTime = Date.now();

    const secondsSinceDecrementStart = secondsSinceByMilliseconds(
      currentTime,
      decrementStartTimeRef.current,
    );

    const secondsRemaining = secondsSinceBySeconds(
      claimTimerCountdownSeconds,
      secondsSinceDecrementStart,
    );

    secondsRemainingSubject.next(secondsRemaining);

    if (secondsRemaining <= 0 && !isClaimable) {
      isClaimButtonVisibleSubject.next(true);
      onFinishedCountdown?.();
      setIsClaimable(true);
    }
  };

  const claim = async () => {
    setCookie(LAST_CLAIM_TIME_MS_COOKIE, Date.now(), {
      ttlMs: ALLOWED_TIME_AWAY_MS,
    });
    decrementStartTimeSubject.next(Date.now());
    isClaimButtonVisibleSubject.next(false);

    clearTimeout(messageTimerRef.current);
    if (source) {
      const economyTransactions = await executeWatchtimeClaimMutation({
        sourceType: source,
      }, {
        additionalTypenames: [
          "OrgUserCounter",
          "OwnedCollectible",
          "SeasonPassProgression",
          "ActivePowerup",
          "EconomyTransaction",
        ],
      });

      const channelPointsClaimed = _.find(economyTransactions, {
        amountId: claimChannelPointEconomyAction?.amountId,
      })?.amountValue || claimChannelPointEconomyActionAmount;
      const xpClaimed = _.find(economyTransactions, {
        amountId: claimXpEconomyAction?.amountId,
      })?.amountValue || claimXpEconomyActionAmount;
      return {
        channelPointsClaimed,
        xpClaimed,
      };
    }
  };

  const resetTimer = () => {
    decrementStartTimeSubject.next(Date.now());
  }

  lastUpdateTimeRef.current = lastUpdateTime;
  decrementStartTimeRef.current = decrementStartTime;
  initialTimeRef.current = initialTime;

  useEffect(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(incrementTimer, TIMER_INCREMENT_MS);

    if (!getCookie("hasReceivedInitial")) {
      setCookie("hasReceivedInitial", "1");
      isClaimButtonVisibleSubject.next(true);
    }

    if (!getCookie("hasReceivedInitialExtra")) {
      setCookie("hasReceivedInitialExtra", "1");
      // this causes invalidation / refetching of all data, so leaving out for now
      // could optimize to have it only invalidate orgUserCounters
    }

    clearInterval(lootTimerRef.current);
    lootTimerRef.current = setInterval(decrementTimer, TIMER_INCREMENT_MS);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(lootTimerRef.current);
    };
  }, [claimTimerCountdownSeconds, isClaimable]);

  return { claim, timeWatchedSecondsSubject, secondsRemainingSubject, resetTimer };
}
