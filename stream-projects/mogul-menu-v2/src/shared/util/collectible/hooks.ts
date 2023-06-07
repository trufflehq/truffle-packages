import { useMemo, useQuery } from "../../../deps.ts";
import { COLLECTIBLE_GET_ALL_BY_ME_QUERY } from "./gql.ts";

export function useCollectibleConnection() {
  const [
    {
      data: collectibleConnectionData,
      fetching: isFetchingCollectibles,
      error: collectibleFetchError,
    },
    reexecuteCollectibleConnQuery,
  ] = useQuery({
    query: COLLECTIBLE_GET_ALL_BY_ME_QUERY,
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
    collectibleConnectionData,
    isFetchingCollectibles,
    collectibleFetchError,
    reexecuteCollectibleConnQuery,
  };
}
