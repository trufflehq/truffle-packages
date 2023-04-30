import {
  abbreviateNumber,
  ImageByAspectRatio,
  React,
  useStyleSheet,
} from "../../../deps.ts";
import { CRYSTAL_BALL_ICON, getPollInfo } from "../../../shared/mod.ts";
import { ActivityListItemProps } from "../activities-tab/activities-tab.tsx";
import { usePageStack } from "../../page-stack/mod.ts";
import PredictionPage from "../../prediction-page/prediction-page.tsx";
import styleSheet from "./prediction-list-item.scss.js";
import ActivityListItem from "../activity-list-item/activity-list-item.tsx";
import { Poll } from "../../../types/mod.ts";
import { PollListItemDescription } from "../poll-list-item/poll-list-item.tsx";

const CHANNEL_POINTS_SRC =
  "https://cdn.bio/assets/images/features/browser_extension/channel-points-default.svg";

export default function PredictionListItem(
  { activity, createdBy }: ActivityListItemProps<Poll>,
) {
  useStyleSheet(styleSheet);
  const { pushPage } = usePageStack();

  const showPredictionPage = () => {
    pushPage(<PredictionPage pollId={activity.id} />);
  };

  const { totalVotes } = getPollInfo(activity);

  return (
    <ActivityListItem
      className="c-prediction-list-item"
      activityType="Prediction"
      createdBy={createdBy}
      icon={CRYSTAL_BALL_ICON}
      color="#AF7AF2"
      iconViewBox={20}
      title={activity.question}
      onClick={showPredictionPage}
      description={<PollListItemDescription poll={activity} />}
      activity={activity}
      preview={totalVotes > 0
        ? (
          <div className="c-prediction-list-item__preview">
            <ImageByAspectRatio
              imageUrl={CHANNEL_POINTS_SRC}
              aspectRatio={1}
              widthPx={18}
              height={18}
            />
            {abbreviateNumber(totalVotes, 1)} in pool
          </div>
        )
        : null}
    />
  );
}
