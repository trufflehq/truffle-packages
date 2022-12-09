import {
  Memo,
  React,
  useComputed,
  useRef,
  useSelector,
  useStyleSheet,
} from "../../deps.ts";
import styleSheet from "./chat-theme.scss.js";
import {
  Alert,
  useAlertSubscription$,
  useSourcetype$,
} from "../../shared/mod.ts";
import WatchPartyTheme, {
  onCleanup as onWatchPartyCleanup,
} from "../watch-party-theme/watch-party-theme.tsx";

const ALERT_CONNECTION_LIMIT = 5;

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

export const ALERT_CHAT_THEMES: ThemeMap = {
  "watch-party": {
    Component: WatchPartyTheme,
    onCleanup: onWatchPartyCleanup,
  },
};

function ChatTheme(
  { themes = ALERT_CHAT_THEMES, alertTypes = ["watch-party"] }: {
    themes?: ThemeMap;
    alertTypes?: string[];
  },
) {
  useStyleSheet(styleSheet);
  const onCleanupFn = useRef<(() => void) | undefined>();
  const { sourceType$ } = useSourcetype$();
  const { alertConnection$ } = useAlertSubscription$({
    limit: ALERT_CONNECTION_LIMIT,
    status: "ready",
    types: alertTypes,
  });

  const latestAlert$ = useComputed(() =>
    alertConnection$.data?.get()?.alertConnection.nodes.find((alert) =>
      alert?.status === "ready"
    )
  );

  // call the onCleanup function when the alert type changes to
  // cleanup any leftover jumper modifications or stylesheets
  latestAlert$.type.onChange((type) => {
    onCleanupFn.current?.();
    if (type) {
      onCleanupFn.current = themes[type].onCleanup;
    }
  });

  return (
    <div>
      <Memo>
        {() => {
          const sourceType = useSelector(() => sourceType$.get());
          const latestAlert = useSelector(() => latestAlert$.get());
          if (!latestAlert) return <></>;
          const Component = themes[latestAlert?.type].Component;
          return <Component alert={latestAlert} sourceType={sourceType} />;
        }}
      </Memo>
    </div>
  );
}

export default ChatTheme;
