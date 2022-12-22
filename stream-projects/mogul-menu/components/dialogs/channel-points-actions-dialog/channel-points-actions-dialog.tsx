import { _, gql, React, useMemo, useQuery } from "../../../deps.ts";
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
  const [{ data: orgUserCounterTypeData }] = useQuery({
    query: ORG_USER_COUNTER_TYPE_QUERY,
  });
  const channelPointsOrgUserCounterType = orgUserCounterTypeData?.orgUserCounterType;

  const [{ data: economyActionConnectionData }] = useQuery({ query: ECONOMY_ACTIONS_QUERY });
  const economyActionConnection = economyActionConnectionData.economyActionConnection;

  const channelPointsEconomyActions = _.reverse(
    economyActionConnection?.nodes?.filter((economyAction) =>
      economyAction?.amountId === channelPointsOrgUserCounterType?.id &&
      (economyAction?.amountValue || economyAction?.data?.amountDescription) &&
      economyAction?.name !== "Prediction refund"
    ),
  );

  return (
    <EconomyActionDialog
      economyActions={channelPointsEconomyActions}
      oucIcon={<ChannelPointsIcon />}
      title={"How to earn channel points"}
    />
  );
}
