import {
  Avatar,
  gql,
  query,
  React,
  useComputed,
  useMutation,
  useQuerySignal,
  useSelector,
  useStyleSheet,
  useSubscriptionSignal,
} from "../../deps.ts";
import { KOTHOrgUser } from "../../types/mod.ts";
import {
  CROWN_ICON,
  hasPermission,
  OrgUserQuerySignal,
} from "../../shared/mod.ts";
import { KOTH_ORG_CONFIG_SUBSCRIPTION, KOTH_USER_QUERY } from "./gql.ts";
import ActivePowerups from "../active-powerups/active-powerups.tsx";
import Tile, { RemoveButton } from "../tile/tile.tsx";

import styleSheet from "./koth-tile.scss.js";

const DELETE_KOTH_MUTATION = gql`
mutation {
  orgConfigUpsert(input: { data: { kingOfTheHill: { userId: "" } } }) {
    orgConfig {
      data
    }
  }
}
`;

export default function KothTile(
  { orgUser$ }: { orgUser$: OrgUserQuerySignal },
) {
  useStyleSheet(styleSheet);
  const { signal$: orgKothConfig$ } = useSubscriptionSignal(
    KOTH_ORG_CONFIG_SUBSCRIPTION,
  );

  const kothUser$ = useComputed(async () => {
    const kothUserId = orgKothConfig$.data?.get()?.org?.orgConfig.data
      .kingOfTheHill?.userId;

    if (!kothUserId) return;

    const res = await query(KOTH_USER_QUERY, { userId: kothUserId });
    return res?.data;
  });

  const kothOrgUser = useSelector(() => kothUser$.orgUser.get!());

  const hasKothDeletePermission = useSelector(() =>
    hasPermission({
      orgUser: orgUser$.orgUser.get!(),
      actions: ["update"],
      filters: {
        orgConfig: { isAll: true, rank: 0 },
      },
    })
  );

  if (!kothOrgUser) return <></>;

  return (
    <MemoizedTile
      kothOrgUser={kothOrgUser}
      hasDeletePermission={hasKothDeletePermission}
    />
  );
}

function arePropsEqual(
  prevProps: OrgUserTileProps,
  nextProps: OrgUserTileProps,
) {
  return prevProps?.kothOrgUser?.user?.id === nextProps?.kothOrgUser?.user?.id;
}

interface OrgUserTileProps {
  kothOrgUser?: KOTHOrgUser;
}

const MemoizedTile = React.memo(
  OrgUserTile,
  arePropsEqual,
);

function OrgUserTile(
  { kothOrgUser, hasDeletePermission }: {
    kothOrgUser?: KOTHOrgUser;
    hasDeletePermission?: boolean;
  },
) {
  const [_deleteKothResult, executeDeleteKothResult] = useMutation(
    DELETE_KOTH_MUTATION,
  );
  const onDelete = async () => {
    await executeDeleteKothResult();
  };
  const activePowerups = kothOrgUser?.activePowerupConnection?.nodes;

  return (
    <Tile
      className="c-king-tile"
      icon={CROWN_ICON}
      headerText="King of the Hill"
      color="#E0BB72"
      removeTooltip="Remove"
      content={() => (
        <div className="content">
          <div className="avatar">
            <Avatar user={kothOrgUser?.user} size={"56px"} />
          </div>
          <div className="info">
            <div className="username">{kothOrgUser?.name}</div>
            <div className="powerups">
              {activePowerups
                ? <ActivePowerups activePowerups={activePowerups} />
                : null}
            </div>
          </div>
        </div>
      )}
      action={hasDeletePermission && (
        <RemoveButton
          onRemove={onDelete}
          shouldHandleLoading={true}
          removeTooltip="Dethrone"
        />
      )}
    />
  );
}
