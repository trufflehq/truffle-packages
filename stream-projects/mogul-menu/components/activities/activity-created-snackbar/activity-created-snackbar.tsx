import { Icon, React, useStyleSheet } from "../../../deps.ts";
import { SnackBar } from "../../snackbar/mod.ts";
import stylesheet from "./activity-created-snackbar.scss.js";

export default function ActivityCreatedSnackbar(
  { icon, iconViewBox, color, activityType }: {
    icon: string;
    iconViewBox?: number;
    color: string;
    activityType: string;
  },
) {
  useStyleSheet(stylesheet);
  return (
    <SnackBar
      style="flat"
      message={
        <div className="c-activity-created-snackbar">
          <Icon icon={icon} color={color} size="24px" viewBox={iconViewBox} />
          <span className="message">{` ${activityType} created!`}</span>
        </div>
      }
    />
  );
}
