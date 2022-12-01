import {
  // search
  Fuse,
  getClient as _getClient,
  Observable,
  ObservableComputed,
  // react
  React,
  useComputed,
  useSelector,
  useStyleSheet,
} from "../../deps.ts";

import { Emote } from "../../shared/mod.ts";
import EmoteRenderer from "../emotes/emote.tsx";
import stylesheet from "./emote-typeahead.scss.js";

export default function EmoteTypeAhead(
  { emoteMap$, chatInput$, numSearchResults }: {
    emoteMap$: ObservableComputed<Map<string, Emote>>;
    chatInput$: Observable<string>;
    numSearchResults: number;
  },
) {
  useStyleSheet(stylesheet);

  const searchableEmotes$ = useComputed(() => {
    const emoteMap = emoteMap$.get();
    return emoteMap &&
      Array.from(emoteMap.keys()).map((key) => ({
        name: key,
        value: emoteMap.get(key),
      }));
  });

  const lastInputToken$ = useComputed(() => {
    const tokens = chatInput$.get().split(" ");
    return tokens[tokens.length - 1];
  });

  const searchResults$ = useComputed(() => {
    const searchableEmotes = searchableEmotes$.get();
    const fuse = new Fuse(searchableEmotes, {
      keys: ["name", "value"],
    });

    const lastInputToken = lastInputToken$.get();
    if (lastInputToken) {
      return fuse.search(lastInputToken).slice(0, numSearchResults);
    }

    return [];
  });

  const onEmoteSelect = (emote?: Emote) => {
    if (!emote) return;
    chatInput$.set((prev) => {
      const tokens = prev.split(" ");
      tokens[tokens.length - 1] = emote.name; // find the last token
      const replacedTokens = tokens.join(" ");

      return replacedTokens + " "; // add an extra space after replacing an emote
    });
  };

  const searchResults = useSelector(() => searchResults$.get());

  if (!searchResults || searchResults.length === 0) return <></>;

  return (
    <div className="c-emote-typeahead">
      {searchResults.map((result, i) => {
        const isFirst = i === 0;
        return result.item.value
          ? (
            <div
              className="result"
              onMouseDown={(e) => {
                // prevent the emote typeahead from taking the focus from the chat input
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={(e) => {
                // prevent the emote typeahead from taking the focus from the chat input
                e.stopPropagation();
                e.preventDefault();
                onEmoteSelect(result.item.value);
              }}
            >
              <EmoteRenderer
                emote={result.item.value}
                shouldShowTooltip={false}
              />
            </div>
          )
          : null;
      })}
    </div>
  );
}
