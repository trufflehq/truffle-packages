import { React, useQuery } from "../../deps.ts";
import { OrgUserCounterType } from "../../types/mod.ts";
import { OrgUserQuerySignal } from "../../shared/mod.ts";
import { BATTLEPASS_ORG_USER_COUNTER_TYPE_QUERY } from "./gql.ts";
import { LeaderboardTile } from "../leaderboard-tile/leaderboard-tile.tsx";

const BATTLE_PASS_LEADERBOARD_DISPLAY_KV_KEY = `mogulMenu:battlepassLeaderboardDisplay`;
export default function BattlepassLeaderboardTile(
  { orgUserWithRoles$ }: { orgUserWithRoles$: OrgUserQuerySignal },
) {
  const [{ data: battlepassOUCTypeData }] = useQuery({
    query: BATTLEPASS_ORG_USER_COUNTER_TYPE_QUERY,
  });

  const orgUserCounterTypeId: OrgUserCounterType["seasonPass"]["orgUserCounterTypeId"] =
    battlepassOUCTypeData?.seasonPass?.orgUserCounterTypeId;

  if (!orgUserCounterTypeId) return <></>;

  return (
    <LeaderboardTile
      headerText="Top Battlepass"
      orgUserCounterTypeId={orgUserCounterTypeId}
      displayKey={BATTLE_PASS_LEADERBOARD_DISPLAY_KV_KEY}
      orgUserWithRoles$={orgUserWithRoles$}
    />
  );
}
