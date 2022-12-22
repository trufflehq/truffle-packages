import { useMemo, useQuery } from "../../../deps.ts";
import { ACTIVE_POWERUPS_QUERY } from "./gql.ts";

export function useActivePowerupConnection() {
  const [
    {
      data: activePowerupConnectionData,
    },
    reexecuteActivePowerupConnQuery,
  ] = useQuery({
    query: ACTIVE_POWERUPS_QUERY,
    requestPolicy: "network-only",
    context: useMemo(
      () => ({
        additionalTypenames: [
          "OwnedCollectible",
          "CollectibleConnection",
          "Collectible",
          "ActivePowerup",
        ],
      }),
      [],
    ),
  });
  return {
    activePowerupConnectionData,
    reexecuteActivePowerupConnQuery,
  };
}
