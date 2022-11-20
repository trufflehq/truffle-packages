import { React, renderToString, useStyleSheet } from "../../deps.ts";
import { Emote } from "../../shared/mod.ts";
import EmoteRenderer from "../emotes/emote.tsx";
import stylesheet from "./rich-text.scss.js";

const SPLIT_PATTERN = /[\s.,?!]/;

function splitWords(string: string): string[] {
  const result: string[] = [];
  let startOfMatch = 0;
  for (let i = 0; i < string.length - 1; i++) {
    if (SPLIT_PATTERN.test(string[i]) !== SPLIT_PATTERN.test(string[i + 1])) {
      result.push(string.substring(startOfMatch, i + 1));
      startOfMatch = i + 1;
    }
  }
  result.push(string.substring(startOfMatch));
  return result;
}

function formatRichText({ text, emoteMap }: { text: string; emoteMap: Map<string, Emote> }) {
  const words = splitWords(text);
  let msg = "";
  for (const word of words) {
    const emote = emoteMap?.get(word);
    if (emote) {
      msg += renderToString(<EmoteRenderer emote={emote} />);
    } else {
      msg += word;
    }
  }

  return msg;
}

export default function RichText(
  { text, emoteMap }: { text: string; emoteMap: Map<string, Emote> },
) {
  useStyleSheet(stylesheet);
  return (
    <span
      className="rich-text"
      dangerouslySetInnerHTML={{
        __html: formatRichText({ text, emoteMap }),
      }}
    />
  );
}
