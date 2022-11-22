import {
  classKebab,
  // urql
  For,
  // ExtensionInfo,
  getClient as _getClient,
  ObservableArray,
  // extension
  ObservableObject,
  // react
  React,
  Switch,
  useStyleSheet,
} from "../../deps.ts";

import { Badge, NormalizedChatMessage } from "../../shared/mod.ts";
import ThemeComponent from "../theme-component/theme-component.tsx";
import styleSheet from "./chat.scss.js";
import { default as BadgeRenderer } from "../badges/badge.tsx";
const VERIFIED_CHECK_IMG_URL =
  "https://cdn.bio/assets/images/features/browser_extension/yt_check_white.svg";

export default function Chat(
  { messages$ }: { messages$: ObservableArray<NormalizedChatMessage[]> },
) {
  useStyleSheet(styleSheet);

  // TODO: use this to render a scroll to bottom button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = (e.target as HTMLDivElement).scrollTop;
    const isPinnedToBottom = scrollTop < 0;
    if (isPinnedToBottom) {
      console.log("not bottom");
    } else {
      console.log("pinned to bottom");
    }
  };

  return (
    <div className="c-chat">
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

export function ChatMessage(
  { item }: { item: ObservableObject<NormalizedChatMessage> },
) {
  return (
    <Switch value={item.type}>
      {{
        "text": () => (
          <MemoizedTextMessage
            id={item.id.peek()}
            richText={item.data?.richText.peek()}
            badges={item.data?.badges.peek()}
            authorName={item.data?.authorName.peek()}
            authorNameColor={item.data?.authorNameColor.peek()}
            isVerified={item.data?.isVerified.peek()}
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
    richText: React.ReactNode; // component with rich text markup (emotes, etc.)
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
          {badges?.map((badge) => <BadgeRenderer src={badge.src} tooltip={badge.tooltip} />)}
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
          {isVerified ? <BadgeRenderer src={VERIFIED_CHECK_IMG_URL} tooltip={"Verified"} /> : null}
        </span>
      </span>
      <span className="separator">
        :
      </span>
      {richText}
    </div>
  );
}
