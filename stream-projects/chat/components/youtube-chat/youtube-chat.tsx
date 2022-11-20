import {
  classKebab,
  // urql
  Client,
  For,
  // ExtensionInfo,
  getClient as _getClient,
  gql,
  // extension
  ObservableObject,
  opaqueObject,
  pipe,
  // react
  React,
  subscribe,
  Switch,
  useObservable,
  useObserve,
  useStyleSheet,
} from "../../deps.ts";

import {
  ConnectionOrgUserWithChatInfoAndPowerups,
  Emote,
  EmoteProvider,
  getOrgUserName,
  getOrgUserNameColor,
  getTruffleBadgesByActivePowerups,
  ORG_USER_CHAT_INFO_FIELDS,
  useTruffleEmoteMap$,
  useYoutubeChannelId$,
} from "../../shared/mod.ts";
import ThemeComponent from "../theme-component/theme-component.tsx";

import { DEFAULT_CHAT_COLORS, getStringHash } from "./utils.ts";
import { useSetChatFrameStyles } from "./jumper.ts";
import styleSheet from "./youtube-chat.scss.js";
import Badge from "../badges/badge.tsx";
import RichText from "../rich-text/rich-text.tsx";

const getClient = _getClient as () => Client;

const NUM_TRUFFLE_BADGES = 2;
const NUM_MESSAGES_TO_RENDER = 250;
const NUM_MESSAGES_TO_CUT = 25;

const VERIFIED_CHECK_IMG_URL =
  "https://cdn.bio/assets/images/features/browser_extension/yt_check_white.svg";

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

type ChatMessageType = "text"; // status, superchat, etc.

interface NormalizedChatMessage {
  id: string;
  type: ChatMessageType;
  richText: React.ReactNode; // string of text
  text: string;
  authorName: string;
  authorNameColor: string;
  badges: Badge[];
  isVerified: boolean;
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
  // : badge === "VERIFIED"
  // ? "https://cdn.bio/assets/images/features/browser_extension/yt_check_white.svg"

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

type Badge = {
  src: string;
  tooltip: string;
};

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
  if (message?.connection?.orgUser?.activePowerupConnection) {
    delete message.connection.orgUser.activePowerupConnection;
  }

  // append youtube badges to truffle badges
  message?.data?.emotes?.forEach((emote) => emoteMap.set(emote.id, normalizeYoutubeEmote(emote)));

  return {
    ...message,
    type: message.data.type,
    // wrap with opaqueObject so legend doesn't track any changes in the react node
    // https://github.com/LegendApp/legend-state/issues/6
    richText: opaqueObject(<RichText text={message.data.message} emoteMap={emoteMap} />),
    text: message.data.message,
    badges: [
      ...(getTruffleBadgesByActivePowerups(message?.connection?.orgUser?.activePowerupConnection) ??
        []).slice(0, NUM_TRUFFLE_BADGES),
      ...(getYoutubeBadgesByMessage(message) ?? []),
    ],
    authorName: getAuthorNameByMessage(message),
    authorNameColor: getUsernameColorByMessage(message),
    isVerified: message.data?.author?.badges?.some((badge) => badge.badge === "VERIFIED"),
  } as NormalizedChatMessage;
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

  useObserve(() => {
    const youtubeChannelId = youtubeChannelId$.get();
    const emoteMap = emoteMap$.get();
    if (youtubeChannelId && emoteMap?.size) {
      pipe(
        getClient().subscription(YOUTUBE_CHAT_MESSAGE_ADDED, { youtubeChannelId }),
        subscribe((response) => {
          const newMessage = response.data?.youtubeChatMessageAdded;
          if (newMessage) {
            messages$.set((prev) => {
              if (newMessage?.id && isDupeYoutubeMessage(prev, newMessage)) {
                return prev;
              }

              const normalizedChatMessage = normalizeTruffleYoutubeChatMessage(
                newMessage,
                emoteMap,
              );

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
    }
  });

  return { messages$, emoteMap$ };
}

export default function YoutubeChat() {
  useStyleSheet(styleSheet);

  const { messages$ } = useYoutubeMessageAddedSubscription();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = (e.target as HTMLDivElement).scrollTop;
    const isPinnedToBottom = scrollTop < 0;
    if (isPinnedToBottom) {
      console.log("not bottom");
    } else {
      console.log("pinned to bottom");
    }
  };

  useSetChatFrameStyles();

  return (
    <div className="c-youtube-chat">
      <ThemeComponent />
      <div className="messages">
        <div className="inner" onScroll={handleScroll}>
          <For<NormalizedChatMessage, {}>
            each={messages$}
            item={ChatMessage}
            optimized
          />
        </div>
      </div>
    </div>
  );
}

// need to split out the message type as well so we can render different types of messages
function ChatMessage(
  { item }: { item: ObservableObject<NormalizedChatMessage> },
) {
  return (
    <Switch value={item.type}>
      {{
        "text": () => (
          <MemoizedTextMessage
            id={item.id.peek()}
            richText={item.richText?.peek()}
            badges={item.badges.peek()}
            authorName={item.authorName.peek()}
            authorNameColor={item.authorNameColor.peek()}
            isVerified={item.isVerified.peek()}
          />
        ),
        default: () => <></>,
      }}
    </Switch>
  );
}

const MemoizedTextMessage = React.memo(TextMessage, (prev, next) => {
  return prev.id === next.id;
});

function TextMessage(
  { id, richText, authorName, authorNameColor, badges, isVerified }: {
    id: string; // used for memoization
    richText: React.ReactNode; // string of text
    authorName: string;
    authorNameColor?: string;
    badges?: Badge[];
    isVerified?: boolean;
  },
) {
  return (
    <div key={id} className="message">
      <span className="author">
        <span className="badges">
          {badges?.map((badge) => <Badge src={badge.src} tooltip={badge.tooltip} />)}
        </span>
        <span
          className={`name ${
            classKebab({
              isVerified,
            })
          }`}
          style={{
            color: authorNameColor,
          }}
        >
          {authorName}
          {isVerified ? <Badge src={VERIFIED_CHECK_IMG_URL} tooltip={"Verified"} /> : null}
        </span>
      </span>
      <span className="separator">
        :
      </span>
      {richText}
    </div>
  );
}
