import { React, useSelector, useSignal, useStyleSheet } from "../../deps.ts";
import styleSheet from "./menu-loading.scss.js";
import { useOrgUserConnectionsQuery } from "../../shared/mod.ts";

export default function MenuLoading() {
  useStyleSheet(styleSheet);

  // if orgUser is still loading, don't render anything (less jank)
  const hasLoaded$ = useSignal(false);
  const hasLoaded = useSelector(() => hasLoaded$.get());
  const { orgUserData$ } = useOrgUserConnectionsQuery();
  const { fetching } = orgUserData$.get();
  if (!fetching && !hasLoaded) {
    hasLoaded$.set(true);
  } else if (fetching && !hasLoaded) {
    return <div className="c-menu-loading"></div>;
  }
  return <></>;
}
