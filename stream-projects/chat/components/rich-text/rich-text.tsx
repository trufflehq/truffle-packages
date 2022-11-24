import { React, useStyleSheet } from "../../deps.ts";
import { Emote } from "../../shared/mod.ts";
import EmoteRenderer from "../emotes/emote.tsx";
import stylesheet from "./rich-text.scss.js";

const SPLIT_PATTERN = /[\s.,?!]/;

function splitWords(string: string): string[] {
  const result: string[] = [];
  let startOfMatch = 0;

  [...string].forEach((_, i) => {
    if (SPLIT_PATTERN.test(string[i]) !== SPLIT_PATTERN.test(string[i + 1])) {
      result.push(string.substring(startOfMatch, i + 1));
      startOfMatch = i + 1;
    }
  });

  result.push(string.substring(startOfMatch));
  return result;
}

function formatRichText({ text, emoteMap }: { text: string; emoteMap: Map<string, Emote> }) {
  const words = splitWords(text);

  return words.map((word) => {
    const emote = emoteMap?.get(word);
    if (emote) {
      return <EmoteRenderer emote={emote} />;
    } else {
      return word;
    }
  });
}

export default function RichText(
  { text, emoteMap }: { text: string; emoteMap: Map<string, Emote> },
) {
  useStyleSheet(stylesheet);
  return (
    <span className="rich-text">
      {formatRichText({ text, emoteMap })}
    </span>
  );
}
