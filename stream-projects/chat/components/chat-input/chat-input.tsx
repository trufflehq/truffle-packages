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
    shouldShowEmoteTypeAhead = true,
  }: {
    emoteMap$: ObservableComputed<Map<string, Emote>>;
    sendMessage: (
      input: { text: string; emoteMap: Map<string, Emote>; chatInput$: Observable<string> },
    ) => void;
    numSearchResults?: number;
    maxMessageLength?: number;
    shouldShowEmoteTypeAhead?: boolean;
  },
) {
  useStyleSheet(stylesheet);
  const chatInput$ = useObservable("");
  const numChars$ = useComputed(() => chatInput$.get().length);
  const isDisabled$ = useComputed(() => numChars$.get() > maxMessageLength);
  const text = useSelector(() => chatInput$.get());
  const emoteMap = useSelector(() => emoteMap$.get());

  const onSendMessage = async () => {
    if (!isDisabled$.get()) {
      await sendMessage({ text, emoteMap, chatInput$ });
    }
  };

  const onEnter = async () => {
    await onSendMessage();
  };

  const onClick = async () => {
    await onSendMessage();
  };

  const handleKeyPress = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      onEnter();
    } else if (ev.key === "Tab") {
      ev.preventDefault();
      // TODO - add tab completion
    }
  };

  const numChars = useSelector(() => numChars$.get());
  const isDisabled = useSelector(() => isDisabled$.get());
  return (
    <div className="chat-input">
      {shouldShowEmoteTypeAhead && !isDisabled
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
        css={{
          border: "none",
          color: "#fff",
        }}
      />
      <div className="actions">
        <div className="send">
          <div className={`char-count ${classKebab({ isDisabled })}`}>
            {numChars}/{maxMessageLength}
          </div>
          <div
            className={`icon ${classKebab({ isDisabled })}`}
            tabIndex={0}
            onClick={onClick}
            title={isDisabled ? "Message is too long" : "Send message"}
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
