import {
  Client,
  // ExtensionInfo,
  getClient as _getClient,
  gql,
  renderToString,
  // extension
  jumper,
  PageIdentifier,
  // legend
  // For,
  // signal,
  // useComputed,
  // useObserve,
  // useSelector,
  // useSignal,
  // ObservableComputed,
  // ObservableObject,
  pipe,
  // react
  React,
  subscribe,
  TruffleGQlConnection,
  useEffect,
  useRef,
  useStyleSheet,
} from "../../deps.ts";

import {
  Computed,
  enableLegendStateReact,
  For,
  Memo,
  observer,
  useComputed,
  useObservable,
  useObserve,
  useSelector,
} from "https://npm.tfl.dev/@legendapp/state@~0.21.0/react";

import {
  Observable,
  observable,
  ObservableComputed,
  ObservableObject,
  opaqueObject
} from "https://npm.tfl.dev/@legendapp/state@~0.21.0";

import ThemeComponent from "../theme-component/theme-component.tsx";

import { DEFAULT_CHAT_COLORS, getChannelId, getStringHash } from "./utils.ts";
import { useSetChatFrameStyles } from "./jumper.ts";
import styleSheet from "./youtube-chat.scss.js";

const getClient = _getClient as () => Client;

const BASE_API_URL = `https://v2.truffle.vip/gateway/emotes`;

const NUM_TRUFFLE_BADGES = 2;
const NUM_MESSAGES_TO_RENDER = 250;
const NUM_MESSAGES_TO_CUT = 25;

type YoutubeChatMessageType = "message";

interface YouTubeChatMessage {
  id: string | number;
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

interface NormalizedChatMessage {
  id: string | number;
  richMessageText: React.ReactNode; // string of text
  text: string;
  authorName: string;
  authorNameColor: string;
  badges: Badge[];
}

interface TruffleYouTubeChatMessage extends YouTubeChatMessage {
  connection: ConnectionOrgUserWithChatInfoAndPowerups;
}

type ConnectionOrgUserWithChatInfoAndPowerups = {
  id: string;
  orgUser: OrgUserWithChatInfo & {
    activePowerupConnection?: ActivePowerupConnection;
  };
};

interface OrgUserWithChatInfo {
  name: string;
  keyValueConnection: ChatKeyValueConnection;
  user: UserWithName;
}

type UserWithName = {
  name: string;
};

type ChatKeyValueConnection = TruffleGQlConnection<ChatKeyValue>;

type ChatKeyValue = MonthsSubbedKeyValue | NameColorKeyValue | KeyValue;

interface KeyValue {
  key: string;
  value: string;
}

interface NameColorKeyValue {
  key: "nameColor";
  value: `#${string}`;
}

interface MonthsSubbedKeyValue {
  key: "subbedMonths";
  value: `${number}`;
}

type ActivePowerupConnection = TruffleGQlConnection<ActivePowerup>;

interface ActivePowerup {
  id: string;
  userId: string;
  data: {
    rgba: string;
    value: string;
  };
  powerup: Powerup;
}

interface Powerup {
  id: string;
  slug: string;
  componentRels: ComponentRel[];
}

type ComponentRel = {
  props: Record<string, unknown> & {
    imageSrc: string;
  };
};

const getOrgUserNameColor = (orgUser: OrgUserWithChatInfo) =>
  orgUser
    ?.keyValueConnection
    ?.nodes
    ?.find((kv) => kv.key === "nameColor")?.value;

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

const TRUFFLE_BADGE_FRAGMENT = gql`
  fragment TruffleBadgeFields on ActivePowerup {
    id
    orgId
    powerup {
      id
      slug
      componentRels {
          props
      }
    }
  }
`;

const ORG_USER_CHAT_INFO_FIELDS = gql`
  fragment OrgUserChatInfoFields on OrgUser {
    name
    orgId
    userId
    keyValueConnection {
      nodes {
        key
        value
      }
    }
    user {
      name
    }
    activePowerupConnection {
      nodes {
        ...TruffleBadgeFields
      }
    }
  }
  ${TRUFFLE_BADGE_FRAGMENT}
`;

const YOUTUBE_CHAT_MESSAGE_ADDED = gql<{ youtubeChatMessageAdded: TruffleYouTubeChatMessage }>`
subscription YouTubeChatMessages($channelId: String) {
  youtubeChatMessageAdded(youtubeChannelId: $channelId)
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

function getBadgeImgSrc(badge: string | "MODERATOR" | "OWNER") {
  const badgeSrc = badge === "MODERATOR"
    ? "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1"
    : badge === "OWNER"
    ? "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1"
    : badge === "VERIFIED"
    ? "https://cdn.bio/assets/images/features/browser_extension/yt_check_white.svg"
    : badge;

  return badgeSrc;
}

export enum EmoteProvider {
  Twitch,
  FFZ,
  BTTV,
  Custom,
  Spore,
  SevenTV,
  Youtube,
}

const EMOTE_PROVIDER_NAME: Record<EmoteProvider, string> = {
  [EmoteProvider.Twitch]: "Twitch",
  [EmoteProvider.FFZ]: "FrankerFaceZ",
  [EmoteProvider.BTTV]: "BetterTTV",
  [EmoteProvider.Custom]: "Global",
  [EmoteProvider.Spore]: "Truffle",
  [EmoteProvider.SevenTV]: "7TV",
  [EmoteProvider.Youtube]: "YouTube",
};

export type Emote = {
  provider: EmoteProvider;
  id: string;
  name: string;
  ext?: string;
  bitIndex?: number;
  channelId?: string;
  src?: string;
};

function getEmoteUrl(emote: Emote) {
  if (emote.provider === EmoteProvider.Twitch) {
    return `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/static/dark/1.0`;
  } else if (emote.provider === EmoteProvider.FFZ) {
    return `https://cdn.frankerfacez.com/emote/${emote.id}/1`;
  } else if (emote.provider === EmoteProvider.BTTV) {
    return `https://cdn.betterttv.net/emote/${emote.id}/2x`;
  } else if (emote.provider === EmoteProvider.SevenTV) {
    return `https://cdn.7tv.app/emote/${emote.id}/1x`;
  } else if (emote.provider === EmoteProvider.Spore && emote?.ext) {
    return `https://cdn.bio/ugc/collectible/${emote.id}.tiny.${emote.ext}`;
  } else if (emote.provider === EmoteProvider.Custom) {
    return `https://v2.truffle.vip/emotes/${emote.id}`;
  } else if (emote.provider === EmoteProvider.Youtube) {
    return emote.src;
  } else {
    return undefined;
  }
}



function normalizeYoutubeEmote(emote: YoutubeEmote) {
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

function getTruffleBadgesByActivePowerups(activePowerupConnection?: ActivePowerupConnection) {
  return activePowerupConnection?.nodes
    ?.map((activePowerup) => ({
      name: activePowerup.powerup.slug,
      src: activePowerup?.powerup?.componentRels?.[0]?.props?.imageSrc,
    }))
    .filter(({ src }) => src !== undefined) ?? [];
}

function getYoutubeBadgesByMessage(message: TruffleYouTubeChatMessage): Badge[] {
  return message.data?.author.badges.map((badge) => ({
    src: badge.badge,
    tooltip: badge.tooltip,
  }));
}

const getOrgUserName = (orgUser: OrgUserWithChatInfo) => orgUser?.name;

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

  // apend youtube badges to truffle badges
  message?.data?.emotes?.forEach((emote) => emoteMap.set(emote.id, normalizeYoutubeEmote(emote)));

  return {
    ...message,
    // wrap with opaqueObject so legend doesn't track any changes in the react node
    // https://github.com/LegendApp/legend-state/issues/6
    richMessageText: opaqueObject(<RichMessageText text={message.data.message} emoteMap={emoteMap} />),
    text: message.data.message,
    badges: [
      ...(getTruffleBadgesByActivePowerups(message?.connection?.orgUser?.activePowerupConnection) ?? []).slice(0, NUM_TRUFFLE_BADGES),
      ...(getYoutubeBadgesByMessage(message) ?? []),
    ],
    authorName: getAuthorNameByMessage(message),
    authorNameColor: getUsernameColorByMessage(message),
    connection: message.connection,
  } as NormalizedChatMessage;
}

async function fetchTruffleEmotesByChannelId(channelId?: string | null) {
  const url = channelId ? `${BASE_API_URL}/c/${channelId}` : BASE_API_URL;
  const res = await fetch(url);
  const emotes: Emote[] = await res.json();

  return emotes;
}

async function getTruffleChatEmoteMapByChannelId(channelId?: string | null) {
  const emoteMap = new Map<string, Emote>();

  const emotes = await fetchTruffleEmotesByChannelId(channelId);

  for (const emote of emotes) {
    emoteMap.set(emote.name, emote);
  }

  return emoteMap;
}

function isDupeYoutubeMessage(
  existingMessages: NormalizedChatMessage[],
  newMessage: TruffleYouTubeChatMessage | undefined,
) {
  const messageIdSet = new Set(existingMessages.map((message) => message.id));

  return newMessage?.id && messageIdSet.has(newMessage?.id);
}

function useMessageAddedSubscription() {
  const messages$ = useObservable<NormalizedChatMessage[]>([]);

  const extensionInfo$ = useObservable(jumper.call("context.getInfo"));

  const channelId$ = useComputed(() => {
    const extensionInfo = extensionInfo$.get();
    const channelId = getChannelId(extensionInfo?.pageInfo);

    console.log("EXTENSION INFO", extensionInfo);
    console.log("PAGE INFO", extensionInfo?.pageInfo);
    
    console.log("CHANNELID", channelId);

    // return "UCGwu0nbY2wSkW8N-cghnLpA"; // jaiden
    return "UCrPseYLGpNygVi34QpGNqpA"; // lud
    // return "UCXBE_QQSZueB8082ml5fslg"; // tim
    // return "UCZaVG6KWBuquVXt63G6xopg"; // riley
    // return "UCvQczq3aHiHRBGEx-BKdrcg"; // myth
    // return "UCG6zBb8GZKo1XZW4eHdg-0Q"; // pcrow
    // return "UCNF0LEQ2abMr0PAX3cfkAMg"; // lupo
    return channelId;
  });

  const emoteMap$ = useComputed(() => {
    return getTruffleChatEmoteMapByChannelId(channelId$.get());
  });

  const emoteMap = useSelector(() => emoteMap$.get());
  console.log("emoteMap", emoteMap);

  useObserve(() => {
    const channelId = channelId$.get();
    const emoteMap = emoteMap$.get();
    if (channelId && emoteMap?.size) {
      pipe(
        getClient().subscription(YOUTUBE_CHAT_MESSAGE_ADDED, { channelId }),
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
  const renderCount = ++useRef(0).current;

  const { messages$ } = useMessageAddedSubscription();

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
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
      <div
        className="status"
        onClick={() => window.open("https://truffle.vip/extension", "_blank")}
      >
        Update Truffle to 3.3.10 for a better chat experience {renderCount}
      </div>
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

// there's some complexity around merging yt message emotes with truffle/3rd party emotes
// since they get sent w/ each message vs. being fetched globally from the server
// we can either render each message to html and then parse it back into a react element
// or we can pass in a function that returns a react element?

function ChatMessage(
  { item }: { item: ObservableObject<NormalizedChatMessage> },
) {
  return (
    <MemoizedTextMessage
      id={item.id.peek()}
      richMessageText={item.richMessageText?.peek()}
      badges={item.badges.peek()}
      authorName={item.authorName.peek()}
      authorNameColor={item.authorNameColor.peek()}
    />
  );
}

const MemoizedTextMessage = React.memo(TextMessage, (prev, next) => {
  return prev.id === next.id;
});

function TextMessage(
  { id, richMessageText, authorName, authorNameColor, badges }: {
    id: string | number; // used for memoization
    richMessageText: React.ReactNode; // string of text
    authorName: string;
    authorNameColor?: string;
    badges?: Badge[];
  },
) {
  return (
    <div key={id} className="message">
      <span className="author">
        <span className="badges">
          {badges?.map((badge) => <Badge src={badge.src} tooltip={badge.tooltip} />)}
        </span>
        <span
          className="name"
          style={{
            color: authorNameColor,
          }}
        >
          {authorName}
          <span className="separator">
            :
          </span>
        </span>
      </span>
      {
        richMessageText
      }
    </div>
  );
}


const splitPattern = /[\s.,?!]/;
function splitWords(string: string): string[] {
  const result: string[] = [];
  let startOfMatch = 0;
  for (let i = 0; i < string.length - 1; i++) {
    if (splitPattern.test(string[i]) !== splitPattern.test(string[i + 1])) {
      result.push(string.substring(startOfMatch, i + 1));
      startOfMatch = i + 1;
    }
  }
  result.push(string.substring(startOfMatch));
  return result;
}

function RichMessageText({ text, emoteMap }: { text: string; emoteMap: Map<string, Emote> }) {
  const words = splitWords(text);
  let msg = "";
  for (const word of words) {
    const emote = emoteMap?.get(word);
    if (emote) {
      msg += renderToString(<Emote emote={emote} />);
    } else {
      msg += word;
    }
  }

  return <span className="message-text" dangerouslySetInnerHTML={{
    __html: msg
  }} />
}

function Badge({ src, tooltip }: { src: string; tooltip: string }) {
  return (
    <div className="truffle-tooltip-wrapper">
      <img
        className="truffle-emote chat-line__message--emote truffle-emote-image badge"
        src={getBadgeImgSrc(src)}
      />
      <div className="truffle-tooltip truffle-tooltip--up truffle-tooltip--align-left">
        {tooltip}
      </div>
    </div>
  );
}

function EmoteToolTip({ emote }: { emote: Emote }) {
  return <div className="c-emote-tool-tip">
    <div>{emote.name}</div>
    <div>{EMOTE_PROVIDER_NAME[emote.provider]}</div>
  </div>
}

function Emote({ emote }: { emote: Emote }) {
  return  <div className="truffle-tooltip-wrapper truffle-emote">
  <img className="truffle-emote chat-line__message--emote truffle-emote-image" src={getEmoteUrl(emote)} />
  <div className="truffle-tooltip truffle-tooltip--up truffle-tooltip--align-center">
    <EmoteToolTip emote={emote} />
  </div>
</div>
}

// function TooltipWrapper