import { React, useStyleSheet } from "../../../deps.ts";
import { Poll } from "../../../types/mod.ts";
import { isPrediction } from "../../../shared/mod.ts";
import { ActivityBannerProps } from "../activity-banner.tsx";
import PredictionBanner from "./prediction-banner.tsx";
import BasePollBanner from "./base-poll-banner.tsx";

import stylesheet from "./poll-banner.scss.js";

const PollBanner = (
  { activity }: ActivityBannerProps<Poll>,
) => {
  useStyleSheet(stylesheet);
  if (!activity) return <></>;

  return isPrediction(activity)
    ? <PredictionBanner poll={activity} />
    : <BasePollBanner poll={activity} />;
};

export default PollBanner;
