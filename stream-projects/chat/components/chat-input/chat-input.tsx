import {
  classKebab,
  getClient as _getClient,
  ImageByAspectRatio,
  Observable,
  ObservableComputed,
  // react
  React,
  useComputed,
  useObservable,
  useSelector,
  useStyleSheet,
} from "../../deps.ts";

import { Emote } from "../../shared/mod.ts";
import stylesheet from "./chat-input.scss.js";
import EmoteTypeAhead from "../emote-typeahead/emote-typeahead.tsx";
import Input from "../input/input.tsx";

const SEND_MESSAGE_ICON_SRC = "https://cdn.bio/assets/images/features/browser_extension/send.svg";
const DEFAULT_NUM_SEARCH_RESULTS = 10;
const DEFAULT_MAX_MESSAGE_LENGTH = 200;

export default function ChatInput(
  {
    emoteMap$,
    sendMessage,
    numSearchResults = DEFAULT_NUM_SEARCH_RESULTS,
    maxMessageLength = DEFAULT_MAX_MESSAGE_LENGTH,
    inputControls,
    statusMessage,
    isDisabled = false,
    shouldShowEmoteTypeAhead = true,
  }: {
    emoteMap$: ObservableComputed<Map<string, Emote>>;
    sendMessage: (
      input: { text: string; emoteMap: Map<string, Emote>; chatInput$: Observable<string> },
    ) => void;
    numSearchResults?: number;
    maxMessageLength?: number;
    inputControls?: React.ReactNode;
    statusMessage?: string;
    isDisabled?: boolean;
    shouldShowEmoteTypeAhead?: boolean;
  },
) {
  useStyleSheet(stylesheet);
  const chatInput$ = useObservable("");
  const numChars$ = useComputed(() => chatInput$.get().length);
  const isMessageLengthExceeded$ = useComputed(() => numChars$.get() > maxMessageLength);
  const isDisabled$ = useComputed(() => isDisabled || isMessageLengthExceeded$.get());

  const text = useSelector(() => chatInput$.get());
  const emoteMap = useSelector(() => emoteMap$.get());

  const onSendMessage = async () => {
    if (!text) return;

    if (!isDisabled$.get()) {
      await sendMessage({ text, emoteMap, chatInput$ });
    }
  };

  const onEnter = async () => {
    await onSendMessage();
  };

  const onClick = async (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    await onSendMessage();
  };

  const handleKeyPress = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      ev.stopPropagation();
      onEnter();
    } else if (ev.key === "Tab") {
      ev.preventDefault();
      // TODO - add tab completion
    }
  };

  const numChars = useSelector(() => numChars$.get());
  const isMessageLengthExceeded = useSelector(() => isMessageLengthExceeded$.get());
  return (
    <div className="chat-input">
      {shouldShowEmoteTypeAhead && !isMessageLengthExceeded
        ? (
          <EmoteTypeAhead
            emoteMap$={emoteMap$}
            chatInput$={chatInput$}
            numSearchResults={numSearchResults}
          />
        )
        : null}
      <Input
        className="input"
        value$={chatInput$}
        onKeyDown={handleKeyPress}
        disabled={isDisabled}
        css={{
          border: "none",
          color: "#fff",
        }}
      />
      {
        statusMessage ? (
          <div className="status-message">
            {statusMessage}
          </div>
        ) : null
      }
      <div className="actions">
      {inputControls ? <div className="controls">
        {inputControls}
      </div> : null}
        <div className="send">
          <div className={`char-count ${classKebab({ isMessageLengthExceeded })}`}>
            {numChars}/{maxMessageLength}
          </div>
          <div
            className={`icon ${classKebab({ isMessageLengthExceeded, isDisabled })}`}
            tabIndex={0}
            onClick={onClick}
            title={isMessageLengthExceeded ? "Message is too long" : "Send message"}
          >
            <ImageByAspectRatio
              imageUrl={SEND_MESSAGE_ICON_SRC}
              aspectRatio={1}
              widthPx={24}
              height={24}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
