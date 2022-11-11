import { useSignal, useSubscription } from "../../deps.ts";
import { ALERT_CONNECTION_SUBSCRIPTION } from "../gql/alert-subscription.ts";

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

export function useLiveAlertConnection() {
  const alerts$ = useSignal([]);

  useSubscription({
    query: ALERT_CONNECTION_SUBSCRIPTION,
  }, (_: undefined, data: AlertResponse) => {
    alerts$.set(data?.alertConnection);
  });

  return { alerts$ };
}
