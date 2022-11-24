import {
  // urql
  Client,
  // ExtensionInfo,
  getClient as _getClient,
  gql,
  // extension
  opaqueObject,
  pipe,
  // react
  React,
  subscribe,
  useObservable,
  useObserve,
  useRef,
  useStyleSheet,
} from "../../deps.ts";

import {
  Badge,
  ConnectionOrgUserWithChatInfoAndPowerups,
  Emote,
  EmoteProvider,
  getOrgUserName,
  getOrgUserNameColor,
  getTruffleBadgesByActivePowerups,
  NormalizedChatMessage,
  ORG_USER_CHAT_INFO_FIELDS,
  useTruffleEmoteMap$,
  useYoutubeChannelId$,
} from "../../shared/mod.ts";

import { DEFAULT_CHAT_COLORS, getStringHash } from "./utils.ts";
import { useSetChatFrameStyles } from "./jumper.ts";
import styleSheet from "./youtube-chat.scss.js";
import RichText from "../rich-text/rich-text.tsx";
import { default as Chat } from "../chat/chat.tsx";

const getClient = _getClient as () => Client;

const NUM_TRUFFLE_BADGES = 2;
const NUM_MESSAGES_TO_RENDER = 250;
const NUM_MESSAGES_TO_CUT = 25;

type YoutubeChatMessageType = "text";

interface YouTubeChatMessage {
  id: string;
  youtubeUserId: string;
  data: YoutubeMessageData;
}

interface YoutubeMessageData {
  id: string;
  message: string;
  emotes: YoutubeEmote[];
  type: YoutubeChatMessageType;
  unix: number;
  author: YoutubeUser;
}

interface YoutubeEmote {
  id: string;
  type: "emoji";
  value: string;
}

interface YoutubeUser {
  id: string;
  name: string;
  badges: YoutubeBadge[];
}

interface YoutubeBadge {
  badge: string; // this is the url for the badge
  tooltip: string; // this is the tooltip for the badge
  type: string; // this is the type of badge
}

interface TruffleYouTubeChatMessage extends YouTubeChatMessage {
  connection: ConnectionOrgUserWithChatInfoAndPowerups;
}

const getUserNameColorByName = (name: string) => {
  const hash = getStringHash(name ?? "base name");
  return DEFAULT_CHAT_COLORS[
    ((hash % DEFAULT_CHAT_COLORS.length) + DEFAULT_CHAT_COLORS.length) % DEFAULT_CHAT_COLORS.length
  ];
};

export function getUsernameColorByMessage(message: TruffleYouTubeChatMessage) {
  const orgUserNameColor = getOrgUserNameColor(message?.connection?.orgUser);
  const youtubeAuthorName = message.data?.author?.name;

  return orgUserNameColor ?? getUserNameColorByName(youtubeAuthorName);
}

const YOUTUBE_CHAT_MESSAGE_ADDED = gql<{ youtubeChatMessageAdded: TruffleYouTubeChatMessage }>`
subscription YouTubeChatMessages($youtubeChannelId: String) {
  youtubeChatMessageAdded(youtubeChannelId: $youtubeChannelId)
  {
    id
    youtubeUserId
    data
    connection {
      id
      orgUser {
        ...OrgUserChatInfoFields
      }
    }
  }
}
${ORG_USER_CHAT_INFO_FIELDS}
`;

function getYoutubeBadgeImgSrc(badge: string | "MODERATOR" | "OWNER") {
  const badgeSrc = badge === "MODERATOR"
    ? "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1"
    : badge === "OWNER"
    ? "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1"
    : badge;

  return badgeSrc;
}

function normalizeYoutubeEmote(emote: YoutubeEmote): Emote {
  return {
    provider: EmoteProvider.Youtube,
    id: emote.id,
    name: emote.id,
    src: emote.value,
  };
}

function getYoutubeBadgesByMessage(message: TruffleYouTubeChatMessage): Badge[] {
  return message.data?.author.badges
    .filter((badge) => badge.badge !== "VERIFIED") // filter out verified badge since we handle that separately
    .map((badge) => ({
      src: getYoutubeBadgeImgSrc(badge.badge),
      tooltip: badge.tooltip,
    }));
}

export function getAuthorNameByMessage(message: TruffleYouTubeChatMessage) {
  const youtubeAuthorName = message.data?.author?.name;

  return getOrgUserName(message?.connection?.orgUser) ?? youtubeAuthorName;
}

function normalizeTruffleYoutubeChatMessage(
  message: TruffleYouTubeChatMessage,
  emoteMap: Map<string, Emote>,
) {
  try {
    // append youtube emotes to truffle emotes
    message?.data?.emotes?.forEach((emote) => emoteMap.set(emote.id, normalizeYoutubeEmote(emote)));

    switch (message.data.type) {
      case "text": {
        return {
          ...message,
          type: message.data.type,
          data: {
            // wrap with opaqueObject so legend doesn't track any changes in the react node since it's a large object
            // https://github.com/LegendApp/legend-state/issues/6
            richText: opaqueObject(<RichText text={message.data.message} emoteMap={emoteMap} />),
            text: message.data.message,
            badges: [
              ...(getTruffleBadgesByActivePowerups(
                message?.connection?.orgUser?.activePowerupConnection,
              ) ??
                []).slice(0, NUM_TRUFFLE_BADGES), // cap to 2 truffle badges
              ...(getYoutubeBadgesByMessage(message) ?? []),
            ],
            authorName: getAuthorNameByMessage(message),
            authorNameColor: getUsernameColorByMessage(message),
            isVerified: message.data?.author?.badges?.some((badge) => badge.badge === "VERIFIED"), // FIXME - move this server side
          },
        } as NormalizedChatMessage;
      }
    }
  } catch (e) {
    console.log("error normalizing message", e);
  }
}

function isDupeYoutubeMessage(
  existingMessages: NormalizedChatMessage[],
  newMessage: TruffleYouTubeChatMessage | undefined,
) {
  const messageIdSet = new Set(existingMessages.map((message) => message.id));

  return newMessage?.id && messageIdSet.has(newMessage?.id);
}

function useYoutubeMessageAddedSubscription() {
  const messages$ = useObservable<NormalizedChatMessage[]>([]);
  const { youtubeChannelId$ } = useYoutubeChannelId$();
  const { emoteMap$ } = useTruffleEmoteMap$();
  const unsubscribeRef = useRef<() => void>();
  useObserve(() => {
    const youtubeChannelId = youtubeChannelId$.get();
    const emoteMap = emoteMap$.get();
    if (youtubeChannelId && emoteMap?.size) {
      unsubscribeRef.current?.();

      const { unsubscribe } = pipe(
        getClient().subscription(YOUTUBE_CHAT_MESSAGE_ADDED, { youtubeChannelId }),
        subscribe((response) => {
          const newMessage = response.data?.youtubeChatMessageAdded;
          if (newMessage) {
            messages$.set((prev) => {
              // FIXME - need to track down why we're getting dupe messages and whether
              // we're getting dupe messages from the server or the client
              if (newMessage?.id && isDupeYoutubeMessage(prev, newMessage)) {
                console.log("is dupe");
                return prev;
              }

              const normalizedChatMessage = normalizeTruffleYoutubeChatMessage(
                newMessage,
                emoteMap,
              );
              if (!normalizedChatMessage) return prev;

              let newMessages = [normalizedChatMessage, ...prev];

              const shouldTrimMessages = newMessages.length > NUM_MESSAGES_TO_RENDER;
              if (shouldTrimMessages) {
                newMessages = newMessages.slice(0, newMessages?.length - NUM_MESSAGES_TO_CUT);
              }
              return newMessages;
            });
          } else {
            console.error("ERRROR", response);
          }
        }),
      );

      unsubscribeRef.current = unsubscribe;
    }
  });

  return { messages$, emoteMap$ };
}

export default function YoutubeChat() {
  useStyleSheet(styleSheet);

  const { messages$ } = useYoutubeMessageAddedSubscription();

  useSetChatFrameStyles();

  return (
    <div className="c-youtube-chat">
      <Chat messages$={messages$} />
    </div>
  );
}
