import { useMemo, useQuery } from "../../../deps.ts";
import { SEASON_PASS_QUERY } from "../../mod.ts";

export function useSeasonPassData() {
  const [{ data, fetching, error }, reexecuteSeasonPassQuery] = useQuery({
    query: SEASON_PASS_QUERY,
    requestPolicy: "network-only",
    context: useMemo(() => ({ additionalTypenames: ["OrgUserCounter", "SeasonPass", "SeasonPassProgression"] }), []),
  });

  return { data, fetching, error, reexecuteSeasonPassQuery };
}
