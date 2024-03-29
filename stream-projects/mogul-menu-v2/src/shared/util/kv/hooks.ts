import { useComputed, useMutation, useUrqlQuerySignal } from "../../../deps.ts";
import { USER_KV_MUTATION, USER_KV_QUERY } from "../../gql/kv.ts";

export function useUserKV<T>(key: string, fallbackValue?: T) {
  const { signal$: userKVResponse$ } = useUrqlQuerySignal(USER_KV_QUERY, {
    key,
  });
  const value$ = useComputed<string>(() =>
    userKVResponse$.data?.orgUser?.keyValue?.value?.get() ?? fallbackValue
  );

  const [_, executeKVUpsertMutation] = useMutation(USER_KV_MUTATION);
  const setUserKV = (value: string) =>
    executeKVUpsertMutation({ key, value }, {
      additionalTypenames: ["OrgUser"],
    });

  return { value$, fetching$: userKVResponse$.fetching, setUserKV };
}
