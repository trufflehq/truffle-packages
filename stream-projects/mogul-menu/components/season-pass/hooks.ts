import { useMemo, useQuery } from "../../deps.ts";
import { SEASON_PASS_QUERY } from "../../shared/mod.ts";

export function useSeasonPassData() {
  const [{ data, fetching, error }, reexecuteSeasonPassQuery] = useQuery({
    query: SEASON_PASS_QUERY,
    context: useMemo(() => ({ additionalTypenames: ["OrgUserCounter"] }), []),
  });

  return { data, fetching, error, reexecuteSeasonPassQuery };
}
