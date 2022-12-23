import {
  _,
  Avatar,
  gql,
  observer,
  React,
  useMutation,
  useQuery,
  useSelector,
  useStyleSheet,
  useSubscriptionSignal,
} from "../../deps.ts";
import { User } from "../../types/mod.ts";
import {
  OrgUserCounter,
  OrgUserCounterConnection,
} from "../../types/org-user-counter.types.ts";
import { LEADERBOARD_COUNTER_QUERY } from "./gql.ts";
import Tile, { HideShowButton } from "../tile/tile.tsx";

import {
  hasPermission,
  OrgUserQuerySignal,
  TROPHY_ICON,
} from "../../shared/mod.ts";

import styleSheet from "./leaderboard-tile.scss.js";

const LEADERBOARD_LIMIT = 3;
const LEADERBOARD_DISPLAY_UPSERT_MUTATION = gql`
  mutation LeaderboardDisplayKeyValueUpsert($sourceId: String, $key: String, $value: String) {
    keyValueUpsert(input: { sourceType: "org" sourceId: $sourceId, key: $key, value: $value }) {
      keyValue {
        key
        value
      }
    }
  }
`;

interface OrgLeaderboardDisplayKVResult {
  org: {
    id: string;
    keyValue: {
      value: `${boolean}`;
    };
  };
}

const ORG_LEADERBOARD_DISPLAY_SUBSCRIPTION = gql<OrgLeaderboardDisplayKVResult>`
subscription BattlepassLeaderboardKeyValue($key: String) {
  org {
    id
    keyValue(input: { key: $key }) {
      key
      value
    }
  }
}`;

function getTop3(leaderboardCounters: OrgUserCounterConnection) {
  let userRanks = leaderboardCounters?.nodes?.map((orgUserCounter) => {
    orgUserCounter.count = parseInt(`${orgUserCounter.count}`);

    return orgUserCounter;
  })
    .sort((a, b) => a.count < b.count ? 1 : 0);

  userRanks = [...new Set(userRanks)];
  userRanks = userRanks.map((rank, i) => ({ ...rank, place: i }));

  return userRanks.slice(0, 3);
}

interface LeaderboardTileProps {
  orgUserWithRoles$: OrgUserQuerySignal;
  headerText: string;
  orgUserCounterTypeId: string;
  displayKey: string;
}

export const LeaderboardTile: React.FC<LeaderboardTileProps> = observer(({
  orgUserWithRoles$,
  headerText,
  orgUserCounterTypeId,
  displayKey,
}: LeaderboardTileProps) => {
  useStyleSheet(styleSheet);
  const [{ data: leaderboardCounterData }] = useQuery({
    query: LEADERBOARD_COUNTER_QUERY,
    variables: {
      limit: LEADERBOARD_LIMIT,
      orgUserCounterTypeId,
    },
  });

  const { signal$: leaderboardDisplay$ } = useSubscriptionSignal(
    ORG_LEADERBOARD_DISPLAY_SUBSCRIPTION,
    { key: displayKey },
  );
  const [, executeLeaderboardKVUpsert] = useMutation(
    LEADERBOARD_DISPLAY_UPSERT_MUTATION,
  );

  const hasTogglePermission = useSelector(() =>
    hasPermission({
      orgUser: orgUserWithRoles$.orgUser.get!(),
      actions: ["update"],
      filters: {
        keyValue: { isAll: true, rank: 0 },
      },
    })
  );

  // default to showing the leaderboard if the value is not set
  const shouldDisplay = useSelector(() => {
    const displayValue = leaderboardDisplay$.data?.get!()?.org.keyValue?.value;
    return typeof displayValue !== "undefined" ? displayValue === "true" : true;
  });
  const orgId = useSelector(() => leaderboardDisplay$.data?.get!()?.org.id);

  const onToggle = async () => {
    await executeLeaderboardKVUpsert({
      sourceId: orgId,
      key: displayKey,
      value: `${!shouldDisplay}`,
    });
  };

  const leaderboardCounters: OrgUserCounterConnection = leaderboardCounterData
    ?.orgUserCounterConnection;

  if (!leaderboardCounters?.nodes) return <></>;

  const top3 = getTop3(leaderboardCounters);

  if (!hasTogglePermission && !shouldDisplay) return <></>;
  return (
    <MemoizedLeaderboardTile
      headerText={headerText}
      top3={top3}
      hasTogglePermission={hasTogglePermission}
      shouldDisplay={shouldDisplay}
      onToggle={onToggle}
    />
  );
});

const MemoizedLeaderboardTile = React.memo(
  LeaderboardTileBase,
  (prev, next) => {
    const prevUserIds = prev.top3.map((ouc) => ouc.orgUser.user.id);
    const nextUserIds = next.top3.map((ouc) => ouc.orgUser.user.id);

    return JSON.stringify(prevUserIds) === JSON.stringify(nextUserIds) &&
      prev.shouldDisplay === next.shouldDisplay;
  },
);

function LeaderboardTileBase(
  { headerText, top3, hasTogglePermission, shouldDisplay, onToggle }: {
    headerText?: string;
    top3: OrgUserCounter[];
    hasTogglePermission: boolean;
    shouldDisplay: boolean;
    onToggle?: () => void;
  },
) {
  return (
    <Tile
      className="c-leaderboard-tile"
      isHidden={hasTogglePermission && !shouldDisplay}
      icon={TROPHY_ICON}
      headerText={headerText}
      color="#CEDEE3"
      textColor="black"
      content={() => <Leaderboard top3={top3} />}
      action={hasTogglePermission && onToggle && (
        <HideShowButton
          onToggle={onToggle}
          isToggled={shouldDisplay}
        />
      )}
    />
  );
}

const ranks = [
  {
    text: "1st",
    color: "#EBC564",
  },
  {
    text: "2nd",
    color: "#ADBCCD",
  },
  {
    text: "3rd",
    color: "#EE8A41",
  },
];

function Leaderboard({ top3 }: { top3: OrgUserCounter[] }) {
  return (
    <div className="content">
      {top3.map((contestant, idx) => (
        <MemoizedLeaderboardAvatar
          key={contestant?.orgUser?.user?.id}
          user={contestant?.orgUser?.user}
          name={contestant?.orgUser?.name ?? contestant?.orgUser?.user?.name}
          place={ranks[idx].text}
          color={ranks[idx].color}
        />
      ))}
    </div>
  );
}

interface LeaderboardAvatarProps {
  user: User;
  name: string;
  place: string;
  color: string;
}

function LeaderboardAvatar(
  { user, name, place, color }: LeaderboardAvatarProps,
) {
  return (
    <div className="contestant">
      <div
        className="avatar"
        style={{
          borderColor: color,
        }}
      >
        <Avatar user={user} size="44px" />
        <div className="username">
          {name}
        </div>
      </div>
      <div
        className="rank"
        style={{
          color: color,
        }}
      >
        {place}
      </div>
    </div>
  );
}

const MemoizedLeaderboardAvatar = React.memo(
  LeaderboardAvatar,
  (prev, next) => {
    return prev.user.id === next.user.id;
  },
);
