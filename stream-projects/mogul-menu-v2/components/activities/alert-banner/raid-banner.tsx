import { React, useStyleSheet } from "../../../deps.ts";
import {
  ACTIVITY_TIMEOUT_SECONDS,
  PARACHUTE_ICON_PATH,
} from "../../../shared/mod.ts";
import Button from "../../../components/base/button/button.tsx";
import ActivityBannerFragment, {
  ActivityBannerInfo,
} from "../activity-banner-fragment/activity-banner-fragment.tsx";
import { ActivityBannerProps } from "../activity-banner.tsx";
import { RaidAlert } from "../../../types/mod.ts";
import stylesheet from "./raid-banner.scss.js";

export default function RaidBanner(
  { activity }: ActivityBannerProps<RaidAlert>,
) {
  useStyleSheet(stylesheet);
  const startTime = new Date(activity?.time);

  return (
    <ActivityBannerFragment
      title={"Raid"}
      startTime={startTime}
      endTime={new Date(startTime.getTime() + ACTIVITY_TIMEOUT_SECONDS * 1000)}
      color={"#F86969"}
      icon={{
        path: PARACHUTE_ICON_PATH,
      }}
      action={activity?.data?.url
        ? <JoinRaidButton url={activity.data.url} />
        : null}
    >
      <ActivityBannerInfo text={activity?.message} />
    </ActivityBannerFragment>
  );
}

function JoinRaidButton({ url }: { url: string }) {
  return (
    <Button
      className="c-join-raid"
      onClick={() => window.open(url, "_blank")}
      style={{
        backgroundColor: "#F86969",
        color: "var(--mm-color-bg-primary)",
        fontWeight: "400",
        fontFamily: "var(--mm-secondary-font-family)",
      }}
    >
      Lets go
    </Button>
  );
}
