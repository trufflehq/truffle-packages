import { React, useSelector, useSignal, useStyleSheet } from "../../deps.ts";
import styleSheet from "./menu-loading.scss.js";
import { useOrgUserConnectionsQuery } from "../../shared/mod.ts";
import { useMeWithConnectionConnection } from "../onboarding/hooks.tsx";

export default function MenuLoading() {
  useStyleSheet(styleSheet);

  // if orgUser is still loading, don't render anything (less jank)
  const hasLoaded$ = useSignal(false);
  const hasLoaded = useSelector(() => hasLoaded$.get());
  const { fetching$: isFetchingOrgUser$ } = useOrgUserConnectionsQuery();
  const isFetchingOrgUser = useSelector(() => isFetchingOrgUser$.get());
  const { fetching$: isFetchingMe$ } = useMeWithConnectionConnection();
  const isFetchingMe = useSelector(() => isFetchingMe$.get());
  const isFetching = isFetchingOrgUser || isFetchingMe;
  if (!isFetching && !hasLoaded) {
    hasLoaded$.set(true);
  } else if (isFetching && !hasLoaded) {
    return <div className="c-menu-loading"></div>;
  }
  return <></>;
}
