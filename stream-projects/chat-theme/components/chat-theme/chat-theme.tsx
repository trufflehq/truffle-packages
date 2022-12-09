import {
  getConnectionSourceType as getChannelSourceType,
  gql,
  Memo,
  React,
  TruffleGQlConnection,
  useComputed,
  useExtensionInfo$,
  useSelector,
  useStyleSheet,
  useSubscriptionSignal,
} from "../../deps.ts";
import styleSheet from "./chat-theme.scss.js";
import WatchPartyTheme from "../watch-party-theme/watch-party-theme.tsx";
// TODO pass in the alert type dynamically
export type AlertStatus = "ready" | "shown";
export type AlertType = "raid-stream" | "activity" | "watch-party";

export interface Alert<
  SourceType extends string,
  AlertDataType = Record<string, any>,
> {
  __typename: "Alert";
  id: string;
  userId: string;
  orgId: string;
  message: string;
  status: AlertStatus;
  type: AlertType;
  sourceType: SourceType; // the sourceType of the activity alert
  time: Date;
  data: AlertDataType;
}

export type AlertConnection = TruffleGQlConnection<
  Alert<AlertType, Record<string, unknown>>
>;
export const ALERTS_SUBSCRIPTION = gql<{ alertConnection: AlertConnection }>`
  subscription AlertsReadyByTypeSubscription($types: [String], $status: String, $limit: Int) {
    alertConnection(input: { types: $types, status: $status }, first: $limit) {
      nodes {
        id
        orgId
        type
        status
        sourceType
        data
      }
    }
  }
`;

export function useAlertSubscription$(
  { status, types, limit }: {
    status?: string;
    types?: string[];
    limit?: number;
  },
) {
  const { signal$: alertConnection$ } = useSubscriptionSignal(
    ALERTS_SUBSCRIPTION,
    { limit, status, types },
  );

  return { alertConnection$ };
}

interface ThemeProps {
  sourceType?: "youtube" | "twitch";
}

type ThemeMap = {
  [x: string]: (props: ThemeProps) => JSX.Element;
};

const ALERT_CHAT_THEMES: ThemeMap = {
  "watch-party": WatchPartyTheme,
};

function ChatTheme() {
  const { signal$: alertConnection$ } = useSubscriptionSignal(
    ALERTS_SUBSCRIPTION,
    { limit: 5, status: "ready", types: ["watch-party"] },
  );

  const latestAlert$ = useComputed(() =>
    alertConnection$.data?.get()?.alertConnection.nodes.find((alert) =>
      alert?.status === "ready"
    )
  );

  const extensionInfo$ = useExtensionInfo$();
  const sourceType$ = useComputed(() => {
    const extensionInfo = extensionInfo$.get();
    return extensionInfo?.pageInfo
      ? getChannelSourceType(extensionInfo.pageInfo)
      : undefined;
  });

  useStyleSheet(styleSheet);
  return (
    <div>
      <Memo>
        {() => {
          // const alertConnection = useSelector(() => alertConnection$.get());

          // console.log("alertConnection", alertConnection);

          // // get latestAlert$ value using useSelector
          const sourceType = useSelector(() => sourceType$.get());
          const latestAlert = useSelector(() => latestAlert$.get());
          if (!latestAlert) return <></>;
          console.log("latestAlert", latestAlert?.type);
          const Component = ALERT_CHAT_THEMES[latestAlert?.type];
          return (
            <>
              {/* <WatchPartyTheme /> */}
              <Component sourceType={sourceType} />
              {/* {ALERT_CHAT_THEMES[latestAlert?.type]} */}
            </>
          );
        }}
      </Memo>
    </div>
  );
}

export default ChatTheme;
