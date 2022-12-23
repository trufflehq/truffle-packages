import { _, gql, React, useQuery } from "../../../deps.ts";
import XPIcon from "../../xp-icon/xp-icon.tsx";
import EconomyActionDialog from "../economy-action-dialog/economy-action-dialog.tsx";

// HACK - plan is to move to a model where we can view all of the economy actions,
// just showing watchtime and linking to the site for now
const XP_INCREMENT_TRIGGER_ID = "b9d69a60-929e-11ec-b349-c56a67a258a0";
const XP_CLAIM_TRIGGER_ID = "fc93de80-929e-11ec-b349-c56a67a258a0";

const SEASON_PASS_QUERY = gql`
  query {
    seasonPass {
      economyActionConnection(first: 100) {
        nodes {
          economyTriggerId
          name
          amountValue
          data {
            description
          }
        }
      }
    }
  }
`;

export default function XpActionsDialog() {
  const [{ data: seasonPassData }] = useQuery({ query: SEASON_PASS_QUERY });
  const seasonPass = seasonPassData?.seasonPass;
  const seasonPassWatchTimeActions = seasonPass?.economyActionConnection?.nodes
    ?.filter(
      (action) =>
        action?.economyTriggerId === XP_INCREMENT_TRIGGER_ID ||
        action?.economyTriggerId === XP_CLAIM_TRIGGER_ID,
    );

  return (
    <EconomyActionDialog
      economyActions={seasonPassWatchTimeActions}
      oucIcon={<XPIcon />}
      title={"How to earn XP"}
    />
  );
}
