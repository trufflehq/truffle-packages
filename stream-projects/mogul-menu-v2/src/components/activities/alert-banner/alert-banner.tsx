import { React, useStyleSheet } from "../../../deps.ts";
import { Alert } from "../../../types/mod.ts";
import { isRaid } from "../../../shared/mod.ts";
import { ActivityBannerProps } from "../activity-banner.tsx";
import RaidBanner from "./raid-banner.tsx";
import stylesheet from "./alert-banner.scss.js";

const AlertBanner = (
  { activity }: ActivityBannerProps<Alert<string, any>>,
) => {
  useStyleSheet(stylesheet);
  return isRaid(activity) ? <RaidBanner activity={activity} /> : <></>; // TODO add a base banner for alerts
};

export default AlertBanner;
