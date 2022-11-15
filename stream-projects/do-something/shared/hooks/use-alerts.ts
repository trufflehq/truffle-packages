import { Observable, useComputed, usePollingQuerySignal } from "../../deps.ts";
import { ALERT_CONNECTION_SUBSCRIPTION } from "../gql/alert-subscription.ts";
import { Action } from "../types/action.ts";
import { Alert } from "../types/alert.ts";

const QUERY_POLL_INTERVAL = 1000;

interface DoSomethingAlert {
  id: string;
  time: string;
  data: {
    user: {
      name: string;
      avatarUrl: string;
    };
    collectible: {
      name: string;
      iconUrl: string;
    };
  };
}

interface AlertResponse {
  alertConnection: {
    nodes: DoSomethingAlert[];
  };
}

export function useAlerts$() {
  const { signal$ } = usePollingQuerySignal({
    query: ALERT_CONNECTION_SUBSCRIPTION,
    variables: {},
    interval: QUERY_POLL_INTERVAL,
  });
  const alerts$ = useComputed(() => signal$.get()?.data?.alertConnection?.nodes);

  return alerts$ as Observable<Alert<Action>[]>;
}
