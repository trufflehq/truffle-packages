import {
  useComputed,
  useSignal,
  useUpdateSignalOnChange,
  useUrqlQuerySignal,
} from "../../../deps.ts";
import { OrgUser } from "../../../types/mod.ts";
import { ORG_USER_QUERY } from "./gql.ts";

export function useOrgUser$() {
  const orgUser$ = useSignal<{ orgUser: OrgUser }>(undefined!);

  const { signal$: orgUserResponse$, reexecuteQuery: refetchOrgUser } =
    useUrqlQuerySignal(ORG_USER_QUERY);
  useUpdateSignalOnChange(orgUser$, orgUserResponse$.data);

  // want signal to be ready immediately, so can't seem to use orgUserResponse$.fetching directly
  const fetching$ = useComputed(() => orgUserResponse$.get()?.fetching);

  return {
    orgUser$,
    fetching$,
    refetchOrgUser,
  };
}
