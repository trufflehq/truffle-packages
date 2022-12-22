import { React, useEffect, useSelector, useSignal, useStyleSheet } from "../../../deps.ts";
import {
  BAR_CHART_ICON_PATH,
  getPollInfo,
  isPrediction,
  useInterval,
} from "../../../shared/mod.ts";
import { ActivityListItemProps } from "../activities-tab/activities-tab.tsx";
import styleSheet from "./poll-list-item.scss.js";
import Time from "../../time/time.tsx";
import ActivityListItem from "../activity-list-item/activity-list-item.tsx";
import PredictionListItem from "../prediction-list-item/prediction-list-item.tsx";
import { Poll } from "../../../types/mod.ts";

const ACTIVE_POLL_INTERVAL = 1000;
const INACTIVE_POLL_INTERVAL = 60000;
export default function PollListItem(props: ActivityListItemProps<Poll>) {
  useStyleSheet(styleSheet);
  if (!props.activity) return <></>;

  return isPrediction(props.activity)
    ? <PredictionListItem {...props} />
    : <BasePollListItem {...props} />;
}

function BasePollListItem({ activity }: ActivityListItemProps<Poll>) {
  return (
    <ActivityListItem
      icon={BAR_CHART_ICON_PATH}
      className="c-poll-list-item"
      activityType="Poll"
      color="#CAE88A"
      title={activity.question}
      description={<PollListItemDescription poll={activity} />}
    />
  );
}

export function PollListItemDescription({ poll }: { poll: Poll }) {
  const { hasPollEnded, pollEndTime, isRefund, hasWinningOption } = getPollInfo(poll);

  const pollMsLeft$ = useSignal(0);
  useEffect(() => {
    const pollMsLeft = new Date(pollEndTime || Date.now()).getTime() - Date.now();
    pollMsLeft$.set(pollMsLeft);
  }, [pollEndTime]);

  // need to set the interval here because we need to update the timer every second when the prediction is still active
  useInterval(() => {
    const pollMsLeft = new Date(pollEndTime || Date.now()).getTime() - Date.now();
    pollMsLeft$.set(pollMsLeft);
  }, !hasPollEnded ? ACTIVE_POLL_INTERVAL : INACTIVE_POLL_INTERVAL);

  const pollMsLeft = useSelector(() => pollMsLeft$.get());

  return (
    <div className="c-poll-list-item__description">
      {hasWinningOption
        ? (
          <span className="winner">
            {/*poll.counter.options[poll.data.winningOptionIndex!].text */}
          </span>
        )
        : hasPollEnded
        ? isRefund ? "Prediction canceled" : "Submissions closed"
        : (
          <>
            <Time ms={pollMsLeft} />
            {" left to vote"}
          </>
        )}
    </div>
  );
}
