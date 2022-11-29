import { jumper, pageHashParams, useComputed, useObservable, gql } from "../../deps.ts";
import { getTruffleChatEmoteMapByYoutubeChannelId, getYoutubeChannelId } from "./utils.ts";
import { OrgUserWithChatInfoConnection } from './types.ts'
import { CONNECTION_FIELDS, ORG_USER_CHAT_INFO_FIELDS } from "./fragments.ts";
import { useQuerySignal } from '../mod.ts'
export function useExtensionInfo$() {
  const extensionInfo$ = useObservable(jumper.call("context.getInfo"));

  return { extensionInfo$ };
}

export function useYoutubeChannelId$() {
  const { extensionInfo$ } = useExtensionInfo$();
  const youtubeChannelId$ = useComputed(() => {
    const extensionInfo = extensionInfo$.get();

    // allows passing in a yt channel id via the url hash, can be used during development or for a dynamic channel id via a url
    const paramYoutubeChannelId = pageHashParams.ytChannelId.get();
    const youtubeChannelId = getYoutubeChannelId(extensionInfo?.pageInfo);

    console.log("EXTENSION INFO", extensionInfo);
    console.log("PAGE INFO", extensionInfo?.pageInfo);
    console.log("CHANNELID", youtubeChannelId);
    
    // return "UCGwu0nbY2wSkW8N-cghnLpA"; // jaiden
    // return "UCrPseYLGpNygVi34QpGNqpA"; // lud
    // return "UCXBE_QQSZueB8082ml5fslg"; // tim
    // return "UCZaVG6KWBuquVXt63G6xopg"; // riley
    // return "UCvQczq3aHiHRBGEx-BKdrcg"; // myth
    // return "UCG6zBb8GZKo1XZW4eHdg-0Q"; // pcrow
    // return "UCNF0LEQ2abMr0PAX3cfkAMg"; // lupo
    return youtubeChannelId ?? paramYoutubeChannelId;
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

export const ORG_USER_WITH_CHAT_INFO_AND_CONNECTIONS = gql<
  { orgUser: OrgUserWithChatInfoConnection }
>`
  query {
    orgUser {
      ...OrgUserChatInfoFields
      connectionConnection (sourceTypes: ["youtube"]) {
        nodes {
          ...ConnectionFields
        }
      }
    }
  } ${ORG_USER_CHAT_INFO_FIELDS} ${CONNECTION_FIELDS}
`;

export function useOrgUserWithChatInfoAndConnections$() {
  const orgUserWithChatInfoAndConnection$ = useQuerySignal(ORG_USER_WITH_CHAT_INFO_AND_CONNECTIONS);

  return { orgUserWithChatInfoAndConnection$ };
}