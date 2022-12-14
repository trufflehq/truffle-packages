import {
  // urql
  Client,
  getAccessToken,
  // ExtensionInfo,
  getClient as _getClient,
  gql,
  jumper,
  Observable,
  // extension
  opaqueObject,
  pipe,
  // react
  React,
  shorthash,
  subscribe,
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
  ConnectionOrgUserWithChatInfoAndPowerups,
  Emote,
  EmoteProvider,
  getOrgUserName,
  getOrgUserNameColor,
  getTruffleBadgesByActivePowerups,
  NormalizedChatMessage,
  ORG_USER_CHAT_INFO_FIELDS,
  OrgUserWithChatInfoConnection,
  useOrgUserWithChatInfoAndConnections$,
  useTruffleEmoteMap$,
  useYoutubeStreamInfo$,
} from "../../shared/mod.ts";

import { DEFAULT_CHAT_COLORS, getStringHash } from "./utils.ts";
import { useSetChatFrameStyles } from "./jumper.ts";
import styleSheet from "./youtube-chat.scss.js";
import RichText from "../rich-text/rich-text.tsx";
import Chat from "../chat/chat.tsx";
import ChatInput from "../chat-input/chat-input.tsx";
import LoginPrompt from "../login-prompt/login-prompt.tsx";

const getClient = _getClient as () => Client;

const NUM_TRUFFLE_BADGES = 2;
const NUM_MESSAGES_TO_RENDER = 250;
const NUM_MESSAGES_TO_CUT = 25;
const YT_MAX_MESSAGE_LENGTH = 200;

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

const YOUTUBE_CHAT_MESSAGE_ADDED = gql<
  { youtubeChatMessageAdded: TruffleYouTubeChatMessage }
>`
subscription YouTubeChatMessages($youtubeChannelId: String, $youtubeVideoId: String) {
  youtubeChatMessageAdded(youtubeChannelId: $youtubeChannelId, youtubeVideoId: $youtubeVideoId)
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

const SEND_YT_MESSAGE_MUTATION = gql`
mutation YoutubeChatMessageUpsert($text: String, $youtubeVideoId: String, $youtubeChannelId: String) {
  youtubeChatMessageUpsert(input: { text: $text, youtubeVideoId: $youtubeVideoId, youtubeChannelId: $youtubeChannelId }) {
    innertubeResponse
  }
}`;

const getUserNameColorByName = (name?: string) => {
  const hash = getStringHash(name ?? "base name");
  return DEFAULT_CHAT_COLORS[
    ((hash % DEFAULT_CHAT_COLORS.length) + DEFAULT_CHAT_COLORS.length) %
    DEFAULT_CHAT_COLORS.length
  ];
};

export function getUsernameColorByMessage(message: TruffleYouTubeChatMessage) {
  const orgUserNameColor = getOrgUserNameColor(message?.connection?.orgUser);
  const youtubeAuthorName = message.data?.author?.name;

  return orgUserNameColor ?? getUserNameColorByName(youtubeAuthorName);
}

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

function getYoutubeBadgesByMessage(
  message: TruffleYouTubeChatMessage,
): Badge[] {
  return message.data?.author?.badges?.filter((badge) =>
    badge.badge !== "VERIFIED"
  ) // filter out verified badge since we handle that separately
    .map((badge) => ({
      src: getYoutubeBadgeImgSrc(badge.badge),
      tooltip: badge.tooltip,
    })) ?? [];
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
    message?.data?.emotes?.forEach((emote) =>
      emoteMap.set(emote.id, normalizeYoutubeEmote(emote))
    );

    switch (message.data?.type) {
      case "text": {
        return {
          ...message,
          type: message.data.type,
          data: {
            // wrap with opaqueObject so legend doesn't track any changes in the react node since it's a large object
            // https://github.com/LegendApp/legend-state/issues/6
            richText: opaqueObject(
              <RichText text={message.data.message} emoteMap={emoteMap} />,
            ),
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
            isVerified: message.data?.author?.badges?.some((badge) =>
              badge.badge === "VERIFIED"
            ), // FIXME - move this server side
          },
        } as NormalizedChatMessage;
      }
    }
  } catch (e) {
    console.log("error normalizing message", e);
  }
}

function generateYoutubeMessage(
  message: string,
  orgUser: OrgUserWithChatInfoConnection,
): TruffleYouTubeChatMessage {
  const youtubeChannelId = orgUser?.connectionConnection?.nodes?.[0]?.sourceId;
  const messageId = generateBespokeMessageId(message, youtubeChannelId);

  return {
    id: messageId,
    data: {
      id: messageId,
      type: "text",
      message,
      author: {
        name: orgUser?.name, // FIXME this is not the YT name
        id: youtubeChannelId ?? "",
        badges: [], // FIXME - pull in badges
      },
      unix: Math.floor(new Date().getTime() / 1000), // FIXME - generate unix timestamp
    },
    connection: {
      orgUser,
    },
  };
}

function generateBespokeMessageId(message: string, authorId?: string) {
  return `${generateBespokeMessageIdPrefix(message, authorId)}-${uuidv4()}`;
}

function generateBespokeMessageIdPrefix(message: string, authorId?: string) {
  return `${shorthash(message.replace(/\s/g, ""))}-${authorId}`;
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
      generateBespokeMessageIdPrefix(
        newMessage.data?.message,
        newMessage.data?.author.id,
      ),
    );
}

function useYoutubeMessageAddedSubscription() {
  const messages$ = useObservable<NormalizedChatMessage[]>([]);

  const { youtubeChannelId$, youtubeVideoId$ } = useYoutubeStreamInfo$();
  const { emoteMap$ } = useTruffleEmoteMap$();
  const unsubscribeRef = useRef<() => void>();
  useObserve(() => {
    const youtubeChannelId = youtubeChannelId$.get();
    console.log('youtubeChannelId', youtubeChannelId)
    const youtubeVideoId = youtubeVideoId$.get();
    const emoteMap = emoteMap$.get();
    if ((youtubeVideoId || youtubeChannelId) && emoteMap?.size) {
      unsubscribeRef.current?.();

      const { unsubscribe } = pipe(
        getClient().subscription(YOUTUBE_CHAT_MESSAGE_ADDED, {
          youtubeChannelId,
          youtubeVideoId,
        }),
        subscribe((response) => {
          const newMessage = response.data?.youtubeChatMessageAdded;
          if (newMessage) {
            messages$.set((prev) => {
              // FIXME - need to track down why we're getting dupe messages and whether
              // we're getting dupe messages from the server or the client
              if (newMessage?.id && isDupeYoutubeMessage(prev, newMessage)) {
                return prev;
              }

              // check if the message was already optimistically rendered by the logged in user
              if (isAlreadySentMessage(prev, newMessage)) {
                return prev;
              }

              const normalizedChatMessage = normalizeTruffleYoutubeChatMessage(
                newMessage,
                emoteMap,
              );
              if (!normalizedChatMessage) return prev;

              let newMessages = [normalizedChatMessage, ...prev];

              const shouldTrimMessages =
                newMessages.length > NUM_MESSAGES_TO_RENDER;
              if (shouldTrimMessages) {
                newMessages = newMessages.slice(
                  0,
                  newMessages?.length - NUM_MESSAGES_TO_CUT,
                );
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

  return { messages$, youtubeChannelId$, emoteMap$ };
}

export default function YoutubeChat(
  { hasChatInput = false, hasScrollToBottom = false, inputControls, onSend, visibleBanners }: {
    hasChatInput?: boolean;
    hasScrollToBottom?: boolean;
    inputControls?: React.ReactNode;
    onSend?: (message: string) => void;
    visibleBanners?: React.ReactNode[];
  },
) {
  useStyleSheet(styleSheet);
  const accessToken$ = useObservable(
    getAccessToken() || jumper.call("storage.get", {
      key: "mogul-menu:accessToken",
    }),
  );
  const isLoginPromptOpen$ = useObservable(false);
  const { messages$, emoteMap$, youtubeChannelId$ } =
    useYoutubeMessageAddedSubscription();
  const [, executeSendYtMessageMutation] = useMutation(
    SEND_YT_MESSAGE_MUTATION,
  );
  const { orgUserWithChatInfoAndConnection$ } =
    useOrgUserWithChatInfoAndConnections$();
  const orgUser = useSelector(() =>
    orgUserWithChatInfoAndConnection$.orgUser.get()
  );
  console.log("orgUser", orgUser);
  const youtubeChannelId = useSelector(() => youtubeChannelId$.get());
  const isLoginPromptOpen = useSelector(() => isLoginPromptOpen$.get());
  function sendMessage(
    { text, emoteMap, chatInput$ }: {
      text: string;
      emoteMap: Map<string, Emote>;
      chatInput$: Observable<string>;
    },
  ) {
    if (!text) return;
    const localYoutubeMessage = generateYoutubeMessage(text, orgUser);
    const normalizedChatMessage = normalizeTruffleYoutubeChatMessage(
      localYoutubeMessage,
      emoteMap,
    );

    if (normalizedChatMessage) {
      messages$.set((prev) => {
        return [normalizedChatMessage, ...prev];
      });
    }

    // clear the chat input after sending the message
    chatInput$.set("");

    // TODO - add some error handling if the server fails to send the message
    try {
      // FIXME - this mutation isn't currently working with our existing YT OAuth flow.
      // we'll either need to convert this over to the YT TV OAuth flow or post the message via jumper
      // to a yt chat frame/webview
      // const result = await executeSendYtMessageMutation({
      //   text,
      //   youtubeChannelId,
      // });

      // if (result.error) {
      //   console.error("error sending message", result.error);

      //   if (result.error.graphQLErrors[0].extensions?.code === 401) {
      //     // prompt OAuth flow
      //     console.log("MISSING OAUTH PERMISSIONS");
      //     isLoginPromptOpen$.set(true);
      //   }
      // }
      onSend?.(text);
    } catch (err) {
      console.error("error sending message", err);
    }
  }

  useSetChatFrameStyles();

  return (
    <div className="c-youtube-chat">
      {visibleBanners
        ? (
          <div className="visible-banners">
            {visibleBanners}
          </div>
        )
        : null}
      <Chat messages$={messages$} hasScrollToBottom={hasScrollToBottom} />
      {hasChatInput
        ? (
          <div className="input">
            {youtubeChannelId
              ? (
                <ChatInput
                  emoteMap$={emoteMap$}
                  sendMessage={sendMessage}
                  maxMessageLength={YT_MAX_MESSAGE_LENGTH}
                  inputControls={inputControls}
                />
              )
              : <div className="empty">Missing Youtube channel ID</div>}
            {isLoginPromptOpen && (
              <LoginPrompt
                isLoginPromptOpen$={isLoginPromptOpen$}
                accessToken$={accessToken$}
                sourceType="youtube"
              />
            )}
          </div>
        )
        : null}
    </div>
  );
}
