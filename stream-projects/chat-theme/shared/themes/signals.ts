import { useComputed, useEffect, useRef } from "../../deps.ts";
import { useAlertSubscription$, useSourceType$ } from "../../shared/mod.ts";
import { Alert } from "../alerts/types.ts";

export const ALERT_CONNECTION_LIMIT = 5;

export interface ThemeProps {
  alert?: Alert; // passing the alert down in case the theme stores state in the alert data
  sourceType?: "youtube" | "twitch";
}

export type ThemeMap = {
  [x: string]: {
    Component: (props: ThemeProps) => JSX.Element;
    onCleanup?: () => void;
  };
};

export function useAlertThemes$(
  { themes, alertTypes }: { themes?: ThemeMap; alertTypes: string[] },
) {
  const onCleanupFn = useRef<(() => void) | undefined>();
  const { sourceType$ } = useSourceType$();
  const { alertConnection$ } = useAlertSubscription$({
    limit: ALERT_CONNECTION_LIMIT,
    status: "ready",
    types: alertTypes,
  });

  useEffect(() => {
    return () => {
      onCleanupFn.current?.();
    };
  }, []);

  const latestAlert$ = useComputed(() =>
    alertConnection$.data?.get()?.alertConnection.nodes.find((alert) =>
      alert?.status === "ready"
    )
  );

  // call the onCleanup function when the alert type changes to
  // cleanup any leftover jumper modifications or stylesheets
  // NOTE: this doesn't really work if YT removes the iframe since this
  // cleanup fn won't get called. We need some sort of way for the injection
  // script to track this and somehow cleanup the steps/stylesheet mods from these
  // chat themes
  latestAlert$.type.onChange((type) => {
    onCleanupFn.current?.();
    if (type) {
      onCleanupFn.current = themes?.[type]?.onCleanup;
    }
  });

  return { sourceType$, latestAlert$ };
}
