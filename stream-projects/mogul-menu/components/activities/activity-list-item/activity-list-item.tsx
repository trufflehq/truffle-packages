import { React, useMemo, useStyleSheet } from "../../../deps.ts";
import { fromNowLong, isActiveActivity } from "../../../shared/mod.ts";
import ListItem from "../../list-item/list-item.tsx";
import stylesheet from "./activity-list-item.scss.js";

export default function ActivityListItem(
  {
    icon,
    color,
    className,
    activityType,
    createdBy,
    title,
    description,
    timestamp,
    activity,
    preview,
    iconViewBox,
    onClick,
  }: {
    icon: string;
    color: string;
    className?: string;
    activityType: React.ReactNode;
    createdBy?: React.ReactNode;
    title: React.ReactNode;
    description: React.ReactNode;
    timestamp?: React.ReactNode;
    activity?: any;
    preview?: React.ReactNode;
    iconViewBox?: number;
    onClick?: (e: React.MouseEvent) => void;
  },
) {
  useStyleSheet(stylesheet);

  // compute timestamp if not provided
  timestamp ??= useMemo(
    () => {
      if (!activity) return "";

      // if it's an active activity, show time since created;
      // if it's not active, show time since ended
      const isActive = isActiveActivity(activity.alert);
      const useEndTime = !isActive && activity.endTime;
      const time = useEndTime ? activity.endTime : activity.time;
      console.log("time", time, isActive);

      // if there's no time, don't show anything
      if (!time) return "";
      // by default, show "(time) ago"
      else {
        return useEndTime
          ? `Ended ${fromNowLong(time, " ago")}`
          : `Created ${fromNowLong(time, " ago")}`;
      }
    },
    [activity],
  );

  return (
    <ListItem
      className={`c-activity-list-item ${className}`}
      icon={icon}
      iconViewBox={iconViewBox}
      color={color}
      onClick={onClick}
    >
      <div className="header">
        <span
          className="type"
          style={{
            color,
          }}
        >
          {activityType}
        </span>
        {createdBy
          ? (
            <span className="created">
              · created by {createdBy}
            </span>
          )
          : null}
        {/* TODO — created by for mods */}
      </div>
      {preview}
      <div className="title">
        {title}
      </div>
      <div className="description">
        {description}
      </div>
      <div className="timestamp mm-text-body-2">
        {timestamp}
      </div>
    </ListItem>
  );
}
