import { ActivityAlert, Poll, RaidAlert, WatchPartyAlert } from "../../../types/mod.ts";
import { getPollInfo, secondsSince } from "../mod.ts";

export const ACTIVITY_TIMEOUT_SECONDS = 100;

/**
 * Returns whether the passed in activity alert is expired. e.g for a poll/prediction we don't want to end
 * the activity until the poll/prediction has ended. For other types of activities that don't have a custom duration
 * set, we want to end the activity after a default amount of time.
 */
export function isActiveActivity<ActivityType, SourceType extends string>(
  activityAlert: ActivityAlert<ActivityType, SourceType>,
) {
  if (!activityAlert?.activity) return false;

  if (activityAlert.status === "shown") return false;

  // if it's a poll, check if the poll has ended and if so whether the poll has been closed longer than the default timeout
  if (isPollActivity(activityAlert)) {
    return isPollActivityActive(activityAlert.activity);
    // default all other activities to a default timeout
  } else if (
    isAlertActivity(activityAlert) && hasAlertUrl(activityAlert.activity)
  ) {
    return activityAlert.activity.status === "ready";
  } else {
    const activityStartTime = new Date(activityAlert?.time);
    return secondsSince(activityStartTime) < ACTIVITY_TIMEOUT_SECONDS;
  }
}

export function isPollActivityActive(poll: Poll) {
  const { hasPollEnded, hasWinningOption, isRefund, pollEndTime } = getPollInfo(poll);

  return hasPollEnded && (hasWinningOption || isRefund)
    ? secondsSince(new Date(pollEndTime)) < ACTIVITY_TIMEOUT_SECONDS
    : true;
}

export function isPollActivity(
  activityAlert?: ActivityAlert<unknown, string>,
): activityAlert is ActivityAlert<Poll, "poll"> {
  return activityAlert?.sourceType === "poll";
}

// TODO alert type deprecated, remove Jan. 2023
export function isAlertActivity(
  activityAlert?: ActivityAlert<unknown, string>,
): activityAlert is ActivityAlert<
  RaidAlert | WatchPartyAlert,
  "alert" | "raid-stream" | "watch-party"
> {
  return activityAlert?.sourceType === "alert" || activityAlert?.sourceType === "raid-stream" ||
    activityAlert?.sourceType === "watch-party";
}

// TODO alert type deprecated, remove alert branch Jan. 2023
export function isRaid(
  alert: unknown & { data?: { url?: string }; type?: string },
): alert is RaidAlert {
  return (alert?.type === "alert" || alert?.type === "raid-stream") &&
    Boolean(alert?.data?.url);
}

export function isWatchParty(
  alert: unknown & { data?: { url?: string }; type?: string },
): alert is WatchPartyAlert {
  return alert?.type === "watch-party" &&
    Boolean(alert?.data?.url);
}

export function hasAlertUrl(alert: unknown & { data?: { url?: string } }) {
  return Boolean(alert?.data?.url);
}
