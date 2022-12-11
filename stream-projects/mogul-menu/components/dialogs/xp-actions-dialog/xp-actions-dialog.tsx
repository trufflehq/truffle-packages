import { _, gql, op, queryObservable, React, useMemo, useObservables } from "../../../deps.ts";
import Button from "../../base/button/button.tsx";
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
  const { seasonPassWatchTimeActionsObs } = useMemo(() => {
    const seasonPassObs = queryObservable(SEASON_PASS_QUERY);

    const seasonPassWatchTimeActionsObs = seasonPassObs.pipe(
      op.map((result) => result?.data?.seasonPass),
      op.map((seasonPass) => {
        return _.filter(
          seasonPass?.economyActionConnection?.nodes,
          (action) =>
            action?.economyTriggerId === XP_INCREMENT_TRIGGER_ID ||
            action?.economyTriggerId === XP_CLAIM_TRIGGER_ID,
        );
      }),
    );
    return {
      seasonPassWatchTimeActionsObs,
    };
  }, []);

  const { seasonPassWatchTimeActions } = useObservables(() => ({
    seasonPassWatchTimeActions: seasonPassWatchTimeActionsObs,
  }));

  return (
    <EconomyActionDialog
      economyActions={seasonPassWatchTimeActions}
      oucIcon={<XPIcon />}
      title={"How to earn XP"}
    />
  );
}
