import {
  classKebab,
  getConnectionSourceType as getChannelSourceType,
  gql,
  LabelPrimitive,
  RadioGroup,
  React,
  useComputed,
  useExtensionInfo$,
  useMutation,
  usePollingQuerySignal,
  useSelector,
  useSignal,
  useStyleSheet,
  useUpdateSignalOnChange,
} from "../../../deps.ts";

import { Page } from "../../page-stack/mod.ts";
import styleSheet from "./admin-settings-page.scss.js";

const CHANNEL_POLLING_INTERVAL = 2000;
interface Channel {
  isLive: boolean;
  isManual: boolean;
}

const CHANNEL_QUERY = gql`
  query ChannelQuery($sourceType: String, $sourceId: String) {
    channel(input: { sourceType: $sourceType, sourceId: $sourceId }) {
      id
      isLive
      isManual
      sourceType
    }
  }
`;

const CHANNEL_UPSERT_MUTATION_QUERY = gql`
  mutation ChannelUpsertMutation($sourceType: String, $isLive: Boolean, $isManual: Boolean) {
    channelUpsert(input: { sourceType: $sourceType, isLive: $isLive, isManual: $isManual }) {
      channel {
        isLive
        isManual
      }
    }
  }
`;

function usePollingChannel$(
  { interval = CHANNEL_POLLING_INTERVAL }: { interval?: number },
) {
  const channel$ = useSignal<{ channel: Channel }>(
    undefined!,
  );

  const { signal$: channelData$, reexecuteQuery: reexecuteChannelQuery } =
    usePollingQuerySignal({
      interval,
      query: CHANNEL_QUERY,
    });

  // only update the channel$ if the channel data has changed
  useUpdateSignalOnChange(channel$, channelData$.data);

  return { channel$, reexecuteChannelQuery };
}

type ChannelStatusSelectionValue = "auto" | "manual-online" | "manual-offline";

const getChannelStatusSelectionValue = ({ channel }: { channel: Channel }) => {
  if (!channel?.isManual) {
    return "auto";
  } else if (channel?.isLive) {
    return "manual-online";
  } else {
    return "manual-offline";
  }
};

function getChannelStatusBySelectionValue(
  { selectionValue }: { selectionValue: ChannelStatusSelectionValue },
) {
  switch (selectionValue) {
    case "auto":
      return { isLive: undefined, isManual: false };
    case "manual-online":
      return { isLive: true, isManual: true };
    case "manual-offline":
      return { isLive: false, isManual: true };
  }
}
export default function AdminSettingsPage() {
  useStyleSheet(styleSheet);
  const [, executeChannelUpsertMutation] = useMutation(
    CHANNEL_UPSERT_MUTATION_QUERY,
  );
  const { channel$ } = usePollingChannel$({
    interval: CHANNEL_POLLING_INTERVAL,
  });
  const selectionValueInput$ = useSignal<
    ChannelStatusSelectionValue | undefined
  >(undefined!);
  const error$ = useSignal("");
  const extensionInfo$ = useExtensionInfo$();

  const selectionValue$ = useComputed(() =>
    selectionValueInput$.get() ||
    getChannelStatusSelectionValue({ channel: channel$.channel.get() })
  );
  const sourceType$ = useComputed(() => {
    const extensionInfo = extensionInfo$.get();
    return extensionInfo?.pageInfo
      ? getChannelSourceType(extensionInfo.pageInfo)
      : "youtube";
  });
  const isLive$ = useComputed(() => channel$.channel?.isLive.get());

  const onValueChange = async (selectionValue: ChannelStatusSelectionValue) => {
    selectionValueInput$.set(selectionValue);
    const channel = channel$.get();
    const upstreamSelectionValue = getChannelStatusSelectionValue({
      channel: channel?.channel,
    });
    const hasChannelStatusChanged = selectionValue && upstreamSelectionValue &&
      selectionValue !== upstreamSelectionValue;

    // if the selection value doesn't match the upstream channel status, update the channel status
    if (hasChannelStatusChanged) {
      const { isLive, isManual } = getChannelStatusBySelectionValue({
        selectionValue,
      });
      error$.set("");
      try {
        const channelUpsertResult = await executeChannelUpsertMutation({
          sourceType: sourceType$.get(),
          isLive,
          isManual,
        }, {
          additionalTypenames: ["Channel"],
        });

        if (channelUpsertResult.error) {
          console.error(
            "error updating channel status",
            channelUpsertResult.error,
          );
          error$.set(channelUpsertResult.error.graphQLErrors[0]?.message);
          return;
        }
      } catch (err) {
        error$.set(err.message);
      }
    }
  };

  const selectionValue = useSelector(() => selectionValue$.get());
  const isLive = useSelector(() => isLive$.get());
  const error = useSelector(() => error$.get());
  return (
    <Page title="Admin Settings">
      <div className="c-admin-settings-page-body">
        <div className="status mm-text-header-caps">Channel Status</div>
        {error && <div className="error">{error}</div>}
        <RadioGroup.Root
          className="radio-group"
          value={selectionValue}
          onValueChange={onValueChange}
        >
          <ChannelStatusRadioButton
            value="auto"
            id="auto"
            label="Auto"
            isLive={isLive}
          />
          <ChannelStatusRadioButton
            value="manual-online"
            id="manual-online"
            label="Manual"
            isLive={true}
          />
          <ChannelStatusRadioButton
            value="manual-offline"
            id="manual-offline"
            label="Manual"
            isLive={false}
          />
        </RadioGroup.Root>
      </div>
    </Page>
  );
}

function ChannelStatusRadioButton(
  { value, id, label, isLive }: {
    value: string;
    id: string;
    label: string;
    isLive: boolean;
  },
) {
  return (
    <div className="c-channel-status-radio-button">
      <RadioGroup.Item className="item" id={id} value={value}>
        <RadioGroup.Indicator className="indicator" />
      </RadioGroup.Item>
      <LabelPrimitive.Root htmlFor={id} className="label">
        {`${label} : `}
        <span
          className={`status ${classKebab({ isLive, isOffline: !isLive })}`}
        >
          {isLive ? "Online" : "Offline"}
        </span>
      </LabelPrimitive.Root>
    </div>
  );
}
