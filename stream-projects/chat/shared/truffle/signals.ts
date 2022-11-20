import { jumper, useComputed, useObservable } from "../../deps.ts";
import { getTruffleChatEmoteMapByYoutubeChannelId, getYoutubeChannelId } from "./utils.ts";

export function useExtensionInfo$() {
  const extensionInfo$ = useObservable(jumper.call("context.getInfo"));

  return { extensionInfo$ };
}

export function useYoutubeChannelId$() {
  const { extensionInfo$ } = useExtensionInfo$();
  const youtubeChannelId$ = useComputed(() => {
    const extensionInfo = extensionInfo$.get();
    const youtubeChannelId = getYoutubeChannelId(extensionInfo?.pageInfo);

    console.log("EXTENSION INFO", extensionInfo);
    console.log("PAGE INFO", extensionInfo?.pageInfo);

    console.log("CHANNELID", youtubeChannelId);

    // return "UCGwu0nbY2wSkW8N-cghnLpA"; // jaiden
    return "UCrPseYLGpNygVi34QpGNqpA"; // lud
    // return "UCXBE_QQSZueB8082ml5fslg"; // tim
    // return "UCZaVG6KWBuquVXt63G6xopg"; // riley
    // return "UCvQczq3aHiHRBGEx-BKdrcg"; // myth
    // return "UCG6zBb8GZKo1XZW4eHdg-0Q"; // pcrow
    // return "UCNF0LEQ2abMr0PAX3cfkAMg"; // lupo
    return youtubeChannelId;
  });

  return { youtubeChannelId$ };
}

export function useTruffleEmoteMap$() {
  const { youtubeChannelId$ } = useYoutubeChannelId$();

  const emoteMap$ = useComputed(() => {
    return getTruffleChatEmoteMapByYoutubeChannelId(youtubeChannelId$.get());
  });

  return { emoteMap$ };
}
