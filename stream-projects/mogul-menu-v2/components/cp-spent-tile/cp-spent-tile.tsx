import { gql, React, useQuery } from "../../deps.ts";
import { OrgUserQuerySignal } from "../../shared/mod.ts";
import { LeaderboardTile } from "../leaderboard-tile/leaderboard-tile.tsx";

const CP_SPENT_ORG_USER_COUNTER_TYPE_QUERY = gql`
  query {
    orgUserCounterType(input: { slug: "channel-points-spent" }) {
      id
    }
  } 
`;
const CHANNEL_POINTS_SPENT_LEADERBOARD_DISPLAY_KV_KEY =
  `mogulMenu:cpSpentLeaderboardDisplay`;

export default function CPSpentTile(
  { orgUser$ }: { orgUser$: OrgUserQuerySignal },
) {
  const [{ data: cpSpentOUCTypeData }] = useQuery({
    query: CP_SPENT_ORG_USER_COUNTER_TYPE_QUERY,
  });

  const orgUserCounterTypeId = cpSpentOUCTypeData?.orgUserCounterType?.id;
  if (!orgUserCounterTypeId) return <></>;

  return (
    <LeaderboardTile
      headerText="Channel Points Spent"
      orgUserCounterTypeId={orgUserCounterTypeId}
      orgUser$={orgUser$}
      displayKey={CHANNEL_POINTS_SPENT_LEADERBOARD_DISPLAY_KV_KEY}
    />
  );
}
