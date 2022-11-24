import {
  // urql
  Client,
  CombinedError,
  // ExtensionInfo,
  getClient as _getClient,
  gql,
  ImageByAspectRatio,
  observable,
  ObservableArray,
  ObservableComputed,
  // extension
  opaqueObject,
  pipe,
  // react
  React,
  subscribe,
  TypedDocumentNode,
  useComputed,
  useMutation,
  useObservable,
  useObserve,
  useRef,
  useSelector,
  useStyleSheet,
  uuidv4,
} from "../../deps.ts";

import {
  Badge,
  CONNECTION_FIELDS,
  ConnectionOrgUserWithChatInfoAndPowerups,
  Emote,
  EmoteProvider,
  getOrgUserName,
  getOrgUserNameColor,
  getTruffleBadgesByActivePowerups,
  NormalizedChatMessage,
  ORG_USER_CHAT_INFO_FIELDS,
  OrgUserWithChatInfo,
  OrgUserWithChatInfoConnection,
  useTruffleEmoteMap$,
  useYoutubeChannelId$,
} from "../../shared/mod.ts";

import { DEFAULT_CHAT_COLORS, getStringHash } from "./utils.ts";
import { useSetChatFrameStyles } from "./jumper.ts";
import styleSheet from "./youtube-chat.scss.js";
import RichText from "../rich-text/rich-text.tsx";
import Input from "../input/input.tsx";
import { default as Chat } from "../chat/chat.tsx";

const getClient = _getClient as () => Client;

const NUM_TRUFFLE_BADGES = 2;
const NUM_MESSAGES_TO_RENDER = 250;
const NUM_MESSAGES_TO_CUT = 25;
const SEND_MESSAGE_ICON_SRC = "https://cdn.bio/assets/images/features/browser_extension/send.svg";

type YoutubeChatMessageType = "text";

interface YouTubeChatMessage {
  id: string;
  youtubeUserId: string;
  data: YoutubeMessageData;
}

interface YoutubeMessageData {
  id: string;
  message: string;
  emotes?: YoutubeEmote[];
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

interface TruffleYouTubeChatMessage extends Partial<YouTubeChatMessage> {
  connection: ConnectionOrgUserWithChatInfoAndPowerups;
}

const getUserNameColorByName = (name?: string) => {
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
  return message.data?.author?.badges?.filter((badge) => badge.badge !== "VERIFIED") // filter out verified badge since we handle that separately
    .map((badge) => ({
      src: getYoutubeBadgeImgSrc(badge.badge),
      tooltip: badge.tooltip,
    })) ?? [];
}

export function getAuthorNameByMessage(message: TruffleYouTubeChatMessage) {
  const youtubeAuthorName = message.data?.author?.name;

  const name = getOrgUserName(message?.connection?.orgUser) ?? youtubeAuthorName;
  console.log("getAuthorNameByMessage", message?.connection?.orgUser, youtubeAuthorName, message);
  return name;
}

function normalizeTruffleYoutubeChatMessage(
  message: TruffleYouTubeChatMessage,
  emoteMap: Map<string, Emote>,
) {
  try {
    // append youtube emotes to truffle emotes
    message?.data?.emotes?.forEach((emote) => emoteMap.set(emote.id, normalizeYoutubeEmote(emote)));

    switch (message.data?.type) {
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
            authorId: message.data.author.id,
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

function isAlreadySentMessage(
  existingMessages: NormalizedChatMessage[],
  newMessage: TruffleYouTubeChatMessage | undefined,
) {
  const messageIdSet = new Set(
    existingMessages.map((message) =>
      generateBespokeMessageIdPrefix(message.data.text, message.data.authorId)
    ),
  );

  return newMessage?.id && newMessage.data?.message &&
    messageIdSet.has(
      generateBespokeMessageIdPrefix(newMessage.data?.message, newMessage.data?.author.id),
    );
}

const messages$ = observable<NormalizedChatMessage[]>([]);

function useYoutubeMessageAddedSubscription() {
  // const messages$ = useObservable<NormalizedChatMessage[]>([]);
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

              if (isAlreadySentMessage(prev, newMessage)) {
                console.log("is already sent message", prev);
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

  // return { messages$, youtubeChannelId$, emoteMap$ };
  return { youtubeChannelId$, emoteMap$ };
}

const SEND_YT_MESSAGE_MUTATION = gql
  `mutation YoutubeChatMessageUpsert($text: String, $youtubeVideoId: String) {
  youtubeChatMessageUpsert(input: { text: $text, youtubeVideoId: $youtubeVideoId }) {
      innerTubeResponse
  }
}`;

export default function YoutubeChat() {
  useStyleSheet(styleSheet);

  // const { messages$, emoteMap$ } = useYoutubeMessageAddedSubscription();
  const { emoteMap$ } = useYoutubeMessageAddedSubscription();
  useSetChatFrameStyles();

  return (
    <div className="c-youtube-chat">
      <Chat messages$={messages$} />
      <ChatInput messages$={messages$} emoteMap$={emoteMap$} />
    </div>
  );
}

function ChatInput(
  { messages$, emoteMap$ }: {
    messages$: ObservableArray<NormalizedChatMessage[]>;
    emoteMap$: ObservableComputed<Map<string, Emote>>;
  },
) {
  const chatInput$ = useObservable("");
  const numChars$ = useComputed(() => chatInput$.get().length);
  const numChars = useSelector(() => numChars$.get());

  const { orgUserWithChatInfoAndConnection$ } = useOrgUserWithChatInfoAndConnections$();

  const text = useSelector(() => chatInput$.get());
  const orgUser = useSelector(() => orgUserWithChatInfoAndConnection$.orgUser.get());
  const emoteMap = useSelector(() => emoteMap$.get());

  const [, executeSendYtMessageMutation] = useMutation(SEND_YT_MESSAGE_MUTATION);

  async function sendMessage() {
    const localMessage = generateYoutubeMessage(text, orgUser);

    console.log("localMessage", localMessage);

    const normalizedChatMessage = normalizeTruffleYoutubeChatMessage(localMessage, emoteMap);

    console.log("normalizedChatMessage", normalizedChatMessage);
    if (normalizedChatMessage) {
      messages$.set((prev) => {
        console.log("adding new message", normalizedChatMessage);
        return [normalizedChatMessage, ...prev];
      });
    }
    chatInput$.set("");

    const result = await executeSendYtMessageMutation({
      text,
      youtubeVideoId: "m4u4EKzebFQ",
    });
    console.log("result", result);

    // normalize and send message
  }

  const onEnter = async () => {
    console.log("on enter", chatInput$.get());
    await sendMessage();
  };
  const handleKeyPress = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      onEnter();
    } else if (ev.key === "Tab") {
      ev.preventDefault();
      console.log("TAB");
    }
  };

  return (
    <div className="chat-input">
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
          <div className="char-count">{numChars}/200</div>
          <div className="icon" tabIndex={0} onClick={sendMessage}>
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

function generateYoutubeMessage(
  message: string,
  orgUser: OrgUserWithChatInfoConnection,
): TruffleYouTubeChatMessage {
  const youtubeChannelId = orgUser.connectionConnection?.nodes?.[0]?.sourceId;
  // what if you send the same message consecutively?
  const messageId = generateBespokeMessageId(message, youtubeChannelId);
  return {
    // connection
    id: messageId, // TODO generate an id or maybe have some type of reconciliation logic based on id
    data: {
      id: messageId, // TODO generate an id or maybe have some type of reconciliation logic based on id
      type: "text",
      message,
      author: {
        name: orgUser?.name, // FIXME this is not the right name
        id: youtubeChannelId,
        badges: [], // FIXME - pull in badges
      },
      unix: 1, // FIXME - generate unix timestamp
    },
    connection: {
      orgUser,
    },
  };
}

function generateBespokeMessageId(message: string, authorId: string) {
  return `${generateBespokeMessageIdPrefix(message, authorId)}-${uuidv4()}`;
}

function generateBespokeMessageIdPrefix(message: string, authorId: string) {
  return `${message.replace(/\s/g, "")}-${authorId}`; // FIXME - shorthash the message
}

export function useQuerySignal<T extends object>(
  query: TypedDocumentNode<T, any>,
  variables?: any,
) {
  const signal$ = observable<T & { error: CombinedError | undefined }>(
    undefined!,
  );
  pipe(
    getClient().query(query, variables),
    subscribe((res) => {
      if (res?.data) {
        signal$.set({ ...res.data, error: undefined });
      }

      // if there's an error in the response, set the `error` observable of the signal
      // but don't void the existing `value` observable since we don't want to lose the last good value
      // and will handle errors separately through updates to the error observable
      if (res?.error) {
        signal$.set((prev) => ({ ...prev, error: res.error }));
      }
    }),
  );
  return signal$;
}
