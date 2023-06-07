import { React, useStyleSheet } from "../../../deps.ts";
import { Poll } from "../../../types/mod.ts";
import { CRYSTAL_BALL_ICON, getPollInfo } from "../../../shared/mod.ts";
import ActivityBannerFragment from "../activity-banner-fragment/activity-banner-fragment.tsx";

import stylesheet from "./base-poll-banner.scss.js";

// TODO: Still need to implement this, this is just a temporary stub for now
export default function BasePollFragment({ poll }: { poll: Poll }) {
  useStyleSheet(stylesheet);
  const { hasPollEnded, pollStartTime, pollEndTime } = getPollInfo(poll);
  return (
    <ActivityBannerFragment
      title={hasPollEnded ? "Poll ended" : "Current poll"}
      startTime={pollStartTime}
      endTime={pollEndTime}
      color={"#CAE88A"}
      icon={{
        path: CRYSTAL_BALL_ICON,
      }}
    >
    </ActivityBannerFragment>
  );
}
