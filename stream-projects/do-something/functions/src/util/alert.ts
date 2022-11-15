import { Action } from "../../../shared/types/action.ts";
import { Alert } from "../../../shared/types/alert.ts";
import { Collectible } from "../../../shared/types/collectible.ts";
import { User } from "../../../shared/types/user.ts";
import { gql, GQLResponse, graphqlReq } from "./graphql-client.ts";

interface DoSomethingAlertUpsertInput {
  type: string;
  data: {
    user: User;
    collectible: Collectible;
  };
}

const ALERT_UPSERT_MUTATION = gql`
  mutation ($input: AlertUpsertInput!){
    alertUpsert(input: $input) {
      alert {
        id
        type
        message
        sourceType
        sourceId
        data
      }
    }
  }
`;

export async function alertUpsert(
  input: DoSomethingAlertUpsertInput,
  accessToken: string,
  orgId: string,
) {
  const resp =
    (await graphqlReq(ALERT_UPSERT_MUTATION, { input }, { accessToken, orgId }).then((resp) =>
      resp.json()
    )) as GQLResponse<{ alertUpsert: { alert: Alert<Action> } }>;

  if (resp?.errors?.length > 0) {
    throw resp.errors;
  }

  return resp?.data?.alertUpsert?.alert;
}
