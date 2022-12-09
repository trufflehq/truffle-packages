import {
  gql,
  TruffleGQlConnection,
  useSubscriptionSignal,
} from "../../deps.ts";
import { Alert } from "./types.ts";

export type AlertConnection = TruffleGQlConnection<
  Alert
>;
export const ALERTS_SUBSCRIPTION = gql<{ alertConnection: AlertConnection }>`
  subscription AlertsReadyByTypeSubscription($types: [String], $status: String, $limit: Int) {
    alertConnection(input: { types: $types, status: $status }, first: $limit) {
      nodes {
        id
        orgId
        type
        status
        sourceType
        data
      }
    }
  }
`;

export function useAlertSubscription$(
  { status, types, limit }: {
    status?: string;
    types?: string[];
    limit?: number;
  },
) {
  const { signal$: alertConnection$ } = useSubscriptionSignal(
    ALERTS_SUBSCRIPTION,
    { limit, status, types },
  );

  return { alertConnection$ };
}
