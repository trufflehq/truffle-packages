import { React, useSelector, useStyleSheet } from "../../../deps.ts";
import {
  hasPermission,
  PARACHUTE_ICON_PATH,
  useOrgUser$,
} from "../../../shared/mod.ts";
import { ActivityListItemProps } from "../activities-tab/activities-tab.tsx";
import ActivityListItem from "../activity-list-item/activity-list-item.tsx";
import stylesheet from "./raid-list-item.scss.js";
import { RaidAlert } from "../../../types/mod.ts";
import { usePageStack } from "../../page-stack/mod.ts";
import RaidPreviewPage from "../raid-preview-page/raid-preview-page.tsx";
export default function RaidListItem(
  { activity, createdBy }: ActivityListItemProps<RaidAlert>,
) {
  useStyleSheet(stylesheet);
  const { orgUser$ } = useOrgUser$();

  const hasAlertPermissions = useSelector(() =>
    hasPermission({
      orgUser: orgUser$.orgUser.get!(),
      actions: ["update", "delete"],
      filters: {
        alert: { isAll: true, rank: 0 },
      },
    })
  );
  const { pushPage } = usePageStack();

  const showRaidPage = () => {
    pushPage(<RaidPreviewPage alertId={activity.id} />);
  };

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(activity.data.url, "_blank");
  };

  return (
    <ActivityListItem
      activityType="Raid"
      icon={PARACHUTE_ICON_PATH}
      iconViewBox={24}
      createdBy={createdBy}
      color="#F86969"
      title={activity.data.title}
      description={activity.data.description}
      onClick={hasAlertPermissions ? showRaidPage : onClick}
    />
  );
}
