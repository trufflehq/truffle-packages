import {
  CombinedError,
  gql,
  Memo,
  ObservableObject,
  React,
  useSelector,
  useStyleSheet,
} from "../../../deps.ts";
import {
  hasPermission,
  isActiveActivity,
  useActivitySubscription$,
  useOrgUser$,
} from "../../../shared/mod.ts";
import Button from "../../base/button/button.tsx";
import PollListItem from "../poll-list-item/poll-list-item.tsx";
import RaidListItem from "../raid-list-item/raid-list-item.tsx";
import WatchPartyListItem from "../watch-party-list-item/watch-party-list-item.tsx";

import { useDialog } from "../../base/dialog-container/dialog-service.ts";
import CreateActivityDialog from "../create-activity-dialog/create-activity-dialog.tsx";
import styleSheet from "./activities-tab.scss.js";
import { ActivityAlert, OrgUser, StringKeys } from "../../../types/mod.ts";

// higher limit means a lot of data streamed back every second during polls
const ACTIVITY_CONNECTION_LIMIT = 10;

export interface ActivityListItemProps<ActivityType> {
  activity: ActivityType;
  createdBy?: string;
}

type ListItemMap<ActivityTypes> = {
  [K in keyof ActivityTypes]: (
    props: ActivityListItemProps<ActivityTypes[K]>,
  ) => JSX.Element;
};

export const DEFAULT_LIST_ITEMS = {
  poll: PollListItem,
  alert: RaidListItem, // TODO alert type deprecated, remove Jan. 2023
  ["raid-stream"]: RaidListItem,
  ["watch-party"]: WatchPartyListItem,
};

export default function ActivitiesTab() {
  return <ActivitiesTabManager activityListItems={DEFAULT_LIST_ITEMS} />;
}

interface ActivitiesTabManagerProps<ActivityTypes> {
  activityListItems: ListItemMap<ActivityTypes>;
}

export function ActivitiesTabManager<
  ActivityListItemTypes,
  SourceType extends StringKeys<ActivityListItemTypes>,
  ActivityType extends ActivityListItemTypes[SourceType],
>(props: ActivitiesTabManagerProps<ActivityListItemTypes>) {
  useStyleSheet(styleSheet);

  const { orgUser$ } = useOrgUser$();

  const { pushDialog } = useDialog();
  const activityListItems =
    (props.activityListItems ?? DEFAULT_LIST_ITEMS) as ListItemMap<
      ActivityListItemTypes
    >;

  const { activityAlertConnection$ } = useActivitySubscription$<
    ActivityType,
    SourceType
  >({
    limit: ACTIVITY_CONNECTION_LIMIT,
    type: "activity",
  });

  const hasPollPermissions = useSelector(() =>
    hasPermission({
      orgUser: orgUser$.orgUser.get!(),
      actions: ["create", "update", "delete"],
      filters: {
        poll: { isAll: true, rank: 0 },
      },
    })
  );

  const onStartActivity = () => {
    pushDialog(<CreateActivityDialog />);
  };

  return (
    <div className="c-activities-tab">
      <div className="list">
        <div className="list-header">
          LIVE ACTIVITIES
        </div>
        {/* activity li's will only rerender if their data changes */}
        <Memo>
          {() => {
            const activityAlerts = useSelector(() =>
              activityAlertConnection$.data.alertConnection.nodes.get()?.filter(
                (alert) => alert?.activity && isActiveActivity(alert),
              )
            );

            return (
              <ActivityGroup
                activityAlerts={activityAlerts}
                activityListItems={activityListItems}
                emptyStateMessage="No live activities"
                orgUser$={orgUser$}
              />
            );
          }}
        </Memo>
        {hasPollPermissions
          ? (
            <Button className="start" style="primary" onClick={onStartActivity}>
              Start an activity
            </Button>
          )
          : null}
      </div>
      <div className="list">
        <div className="list-header">
          ACTIVITY HISTORY
        </div>
        {/* activity li's will only rerender if their data changes */}
        <Memo>
          {() => {
            const activityAlerts = useSelector(() =>
              activityAlertConnection$.data.alertConnection.nodes.get()?.filter(
                (alert) => alert?.activity && !isActiveActivity(alert),
              )
            );

            return (
              <ActivityGroup
                activityAlerts={activityAlerts}
                activityListItems={activityListItems}
                emptyStateMessage="No past activities"
                orgUser$={orgUser$}
              />
            );
          }}
        </Memo>
      </div>
    </div>
  );
}

function ActivityGroup<
  ActivityListItemTypes,
  SourceType extends StringKeys<ActivityListItemTypes>,
  ActivityType extends ActivityListItemTypes[SourceType],
>(
  { activityAlerts, activityListItems, emptyStateMessage, orgUser$ }: {
    activityAlerts: ActivityAlert<ActivityType, SourceType>[];
    activityListItems: ListItemMap<ActivityListItemTypes>;
    emptyStateMessage: string;
    orgUser$: ObservableObject<
      { orgUser: OrgUser } & {
        error: CombinedError | undefined;
      }
    >;
  },
) {
  const hasPermissions = useSelector(() =>
    hasPermission({
      orgUser: orgUser$.orgUser.get!(),
      actions: ["create", "update", "delete"],
      filters: {
        poll: { isAll: true, rank: 0 },
      },
    })
  );

  return activityAlerts?.length
    ? (
      <div className="list-group">
        {activityAlerts?.map((alert) => {
          const ActivityListItem = alert.sourceType
            ? activityListItems[alert.sourceType]
            : null;
          {/* This was necessary to make the TS compiler happy, for some reason it wasn't liking the JSX format <Component activity={activityAlert.activity} />*/}
          return ActivityListItem &&
            React.createElement(ActivityListItem, {
              activity: alert.activity,
              createdBy: hasPermissions ? alert.orgUser?.name : undefined,
            });
        })}
      </div>
    )
    : <div className="empty-list-group">{emptyStateMessage}</div>;
}
