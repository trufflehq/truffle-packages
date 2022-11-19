import {
  Client,
  // ExtensionInfo,
  getClient as _getClient,
  gql,
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
  id: string
  type: 'emoji'
  value: string
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

interface NormalizedYoutubeChatMessage extends YouTubeChatMessage {
  html: string;
  connection: {
    id: string;
    orgUser: OrgUserWithChatInfo & {
      truffleBadges: TruffleBadge[];
    };
  };
}

interface TruffleBadge {
  name: string;
  src: string;
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

export function getUsernameColorByMessage(message: NormalizedYoutubeChatMessage) {
  const orgUserNameColor = getOrgUserNameColor(message.connection.orgUser);
  const youtubeAuthorName = message.data?.author?.name;

  return orgUserNameColor ?? getUserNameColorByName(youtubeAuthorName);
}

const getOrgUserName = (orgUser: OrgUserWithChatInfo) => orgUser?.name;

export function getAuthorNameByMessage(message: NormalizedYoutubeChatMessage) {
  const youtubeAuthorName = message.data?.author?.name;

  return getOrgUserName(message.connection.orgUser) ?? youtubeAuthorName;
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

const URL_REGEX = /^(http|https):\/\/*/;

function getBadgeImgSrc(badge: string | "MODERATOR" | "OWNER") {
  const badgeSrc = badge === "MODERATOR"
    ? "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1"
    : badge === "OWNER"
    ? "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1"
    : badge === 'VERIFIED'
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
  } else if(emote.provider === EmoteProvider.Youtube) {
    return emote.src
  }
   else {
    return undefined;
  }
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

function formatMessageHtmlStr({ text, emoteMap }: { text: string; emoteMap: Map<string, Emote> }) {
  const words = splitWords(text);
  let msg = "";
  for (const word of words) {
    const emote = emoteMap?.get(word);
    if (emote) {
      const tooltip = `
      <div>${emote.name}</div>
      <div>${EMOTE_PROVIDER_NAME[emote.provider]}</div>
      `

      msg += `
      <div class="truffle-tooltip-wrapper truffle-emote">
        <img class="truffle-emote chat-line__message--emote truffle-emote-image" src="${getEmoteUrl(emote)}" />
        <div class="truffle-tooltip truffle-tooltip--up truffle-tooltip--align-center">${tooltip}</div>
      </div>
      `;
    } else {
      msg += word;
    }
  }

  return msg;
}

function getBadgesByActivePowerups(activePowerupConnection?: ActivePowerupConnection) {
  return activePowerupConnection?.nodes
    ?.map((activePowerup) => ({
      name: activePowerup.powerup.slug,
      src: activePowerup?.powerup?.componentRels?.[0]?.props?.imageSrc
    }))
    .filter(({ src }) => src !== undefined)

}

function normalizeYoutubeEmote(emote: YoutubeEmote) {
  return {
    provider: EmoteProvider.Youtube,
    id: emote.id,
    name: emote.id,
    src: emote.value
  };
}

function normalizeTruffleYoutubeChatMessage(
  message: TruffleYouTubeChatMessage,
  emoteMap: Map<string, Emote>,
) {
  const truffleBadges = getBadgesByActivePowerups(
    message?.connection?.orgUser?.activePowerupConnection,
  );

  if (message?.connection?.orgUser?.activePowerupConnection) {
    delete message.connection.orgUser.activePowerupConnection;
  }

  message?.data?.emotes?.forEach((emote) => emoteMap.set(emote.id, normalizeYoutubeEmote(emote)));

  return {
    ...message,
    html: formatMessageHtmlStr({ text: message.data.message, emoteMap }),
    connection: {
      ...message?.connection,
      orgUser: {
        ...message?.connection?.orgUser,
        truffleBadges,
      },
    },
  } as NormalizedYoutubeChatMessage;
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
    const url = getEmoteUrl(emote);
    // if (url) {
    //   emoteMap.set(emote.name, url);
    // }
    emoteMap.set(emote.name, emote);
  }

  return emoteMap;
}

const messages$ = observable<NormalizedYoutubeChatMessage[]>([]);

function isMessageDupe(
  existingMessages: NormalizedYoutubeChatMessage[],
  newMessage: TruffleYouTubeChatMessage | undefined,
) {
  const messageIdSet = new Set(existingMessages.map((message) => message.id));

  return newMessage?.id && messageIdSet.has(newMessage?.id);
}

function useMessageAddedSubscription() {
  const extensionInfo$ = useObservable(jumper.call("context.getInfo"));

  const channelId$ = useComputed(() => {
    const extensionInfo = extensionInfo$.get();
    console.log("EXTENSION INFO", extensionInfo);

    // jumper.call("platform.log", `extensionInfo compute ${JSON.stringify(extensionInfo)}`);
    console.log("PAGE INFO", extensionInfo?.pageInfo);
    const channelId = getChannelId(extensionInfo?.pageInfo);

    console.log("CHANNELID", channelId);
    // jumper.call("platform.log", `extensionInfo compute channelId ${channelId}`);
    // return "UCGwu0nbY2wSkW8N-cghnLpA"; // jaiden
    return "UCrPseYLGpNygVi34QpGNqpA"; // lud
    // return "UCXBE_QQSZueB8082ml5fslg"; // tim
    // return "UCZaVG6KWBuquVXt63G6xopg"; // riley
    // return "UCvQczq3aHiHRBGEx-BKdrcg"; // myth
    // return "UCG6zBb8GZKo1XZW4eHdg-0Q"; // pcrow
    // return "UCNF0LEQ2abMr0PAX3cfkAMg";
    return channelId;
    // return channelId ?? "UCNF0LEQ2abMr0PAX3cfkAMg";
    // return "UCNF0LEQ2abMr0PAX3cfkAMg";
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
              if (newMessage?.id && isMessageDupe(prev, newMessage)) {
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
}

export default function YoutubeChat() {
  useStyleSheet(styleSheet);
  useMessageAddedSubscription();

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
        Update Truffle to 3.3.10 for a better chat experience
      </div>
      <div className="messages">
        <div className="inner" onScroll={handleScroll}>
          <For<NormalizedYoutubeChatMessage, {}>
            each={messages$}
            item={ChatMessage}
            optimized
          />
        </div>
      </div>
    </div>
  );
}

function ChatMessage(
  { item }: { item: ObservableObject<NormalizedYoutubeChatMessage> },
) {
  return <MemoizedTextMessage message={item.peek()} />;
}

const MemoizedTextMessage = React.memo(TextMessage, (prev, next) => {
  return prev.message.id === next.message.id;
});

function getTruffleBadgesByMessage(message: NormalizedYoutubeChatMessage) {
  const badges = message.connection?.orgUser?.truffleBadges?.map((badge) => badge)
    .slice(0, NUM_TRUFFLE_BADGES) ?? [];

  if (!badges.length) {
    return;
  }
  return badges.map((badge) => <Badge src={badge.src} tooltip={badge.name} />);
}

function Badge({ src, tooltip }: { src: string; tooltip: string }) {

  return <div className="truffle-tooltip-wrapper">
  <img className="truffle-emote chat-line__message--emote truffle-emote-image badge" src={getBadgeImgSrc(src)} />
  <div className="truffle-tooltip truffle-tooltip--up truffle-tooltip--align-left">{tooltip}</div>
</div>
}

function getYoutubeBadgesByMessage(message: NormalizedYoutubeChatMessage) {
  return message.data?.author.badges.map((badge) => <Badge src={badge.badge} tooltip={badge.tooltip} />)
}

function TextMessage(
  { message }: { message: NormalizedYoutubeChatMessage },
) {
  return (
    <div className="message">
      <span className="author">
        <span className="badges">
          {getYoutubeBadgesByMessage(message)}
          {getTruffleBadgesByMessage(message)}
        </span>
        <span
          className="name"
          style={{
            color: getUsernameColorByMessage(message),
          }}
        >
          {getAuthorNameByMessage(message)}
          <span className="separator">
            :
          </span>
        </span>
      </span>
      <span
        className="message-text"
        dangerouslySetInnerHTML={{
          __html: message?.html,
        }}
      >
      </span>
    </div>
  );
}
