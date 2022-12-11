import {
  React,
  gql,
  Obs,
  op,
  queryObservable,
  useMemo,
  useObservables,
  _,
} from "../../../deps.ts";
import ChannelPointsIcon from "../../channel-points-icon/channel-points-icon.tsx";
import EconomyActionDialog from "../economy-action-dialog/economy-action-dialog.tsx";

const ORG_USER_COUNTER_TYPE_QUERY = gql`
  query {
    orgUserCounterType(input: { slug: "channel-points" }) {
      id
      slug
      name
      decimalPlaces
    }
  }
`;

const ECONOMY_ACTIONS_QUERY = gql`
  query {
    economyActionConnection(
      input: { amountType: "orgUserCounterType" }
      first: 500
    ) {
      nodes {
        id
        orgId
        name
        economyTriggerId
        amountValue
        amountType
        amountId
        amountSourceType
        isVariableAmount
        data {
          description
          cooldownSeconds
          amountDescription
        }
      }
    }
  }
`;

export default function ChannelPointsActionsDialog() {
  const { channelPointsEarnActionsObs } = useMemo(() => {
    const channelPointsOrgUserCounterTypeObs = queryObservable(
      ORG_USER_COUNTER_TYPE_QUERY,
      {}
    ).pipe(op.map((result) => result?.data?.orgUserCounterType));

    const economyActionsObs = queryObservable(ECONOMY_ACTIONS_QUERY, {}).pipe(
      op.map((result) => result?.data?.economyActionConnection)
    );

    const channelPointsEarnActionsObs = Obs.combineLatest(
      channelPointsOrgUserCounterTypeObs,
      economyActionsObs
    ).pipe(
      op.map(([orgUserCounterType, economyActions]) => {
        return _.filter(economyActions?.nodes, {
          amountId: orgUserCounterType?.id,
        });
      }),
      op.map((channelPointsActions) => {
        return _.filter(channelPointsActions, (action) => {
          return action?.amountValue || action?.data?.amountDescription;
        });
      }),
      op.map((channelPointsActions) =>
        _.filter(
          channelPointsActions,
          (action) => action?.name !== "Prediction refund"
        )
      ),
      op.map((channelPointsActions) => _.reverse(channelPointsActions))
    );
    return {
      economyActionsObs,
      channelPointsOrgUserCounterTypeObs,
      channelPointsEarnActionsObs,
    };
  }, []);

  const { channelPointsEarnActions } = useObservables(() => ({
    channelPointsEarnActions: channelPointsEarnActionsObs,
  }));

  return (
    <EconomyActionDialog
      economyActions={channelPointsEarnActions}
      oucIcon={<ChannelPointsIcon />}
      title={"How to earn channel points"}
    />
  );
}
