import { React, useSelector, useStyleSheet } from "../../../deps.ts";
import {
  DISCO_BALL_PATH,
  hasPermission,
  useOrgUserWithRoles$,
} from "../../../shared/mod.ts";
import { ActivityListItemProps } from "../activities-tab/activities-tab.tsx";
import ActivityListItem from "../activity-list-item/activity-list-item.tsx";
import stylesheet from "./watch-party-list-item.scss.js";
import { WatchPartyAlert } from "../../../types/mod.ts";
import { usePageStack } from "../../page-stack/mod.ts";
import AlertPreviewPage from "../alert-preview-page/alert-preview-page.tsx";

export default function WatchPartyListItem(
  { activity, createdBy }: ActivityListItemProps<WatchPartyAlert>,
) {
  useStyleSheet(stylesheet);
  const orgUserWithRoles$ = useOrgUserWithRoles$();

  const hasAlertPermissions = useSelector(() =>
    hasPermission({
      orgUser: orgUserWithRoles$.orgUser.get!(),
      actions: ["update", "delete"],
      filters: {
        alert: { isAll: true, rank: 0 },
      },
    })
  );
  const { pushPage } = usePageStack();

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    pushPage(
      <AlertPreviewPage
        pageTitle="Watch Party"
        alertId={activity.id}
        activeText="Watch party is live"
        deleteConfirmText="Are you sure you want to delete this watch party?"
        endButtonText="End watch party"
        hasAdminPerms={hasAlertPermissions}
      />,
    );
  };

  return (
    <ActivityListItem
      activityType="Watch Party"
      icon={DISCO_BALL_PATH}
      iconViewBox={24}
      createdBy={createdBy}
      color="#71DBDB"
      title={activity.data.title}
      description={activity.data.description}
      onClick={onClick}
    />
  );
}
