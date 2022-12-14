import {
  arrowDownIconPath,
  classKebab,
  // urql
  For,
  // ExtensionInfo,
  getClient as _getClient,
  Icon,
  ObservableArray,
  // extension
  ObservableObject,
  // react
  React,
  Switch,
  useObservable,
  useRef,
  useSelector,
  useStyleSheet,
} from "../../deps.ts";

import { Badge, NormalizedChatMessage } from "../../shared/mod.ts";
import ThemeComponent from "../theme-component/theme-component.tsx";
import styleSheet from "./chat.scss.js";
import { default as BadgeRenderer } from "../badges/badge.tsx";
const VERIFIED_CHECK_IMG_URL =
  "https://cdn.bio/assets/images/features/browser_extension/yt_check_white.svg";

export default function Chat(
  { messages$, hasScrollToBottom = false }: {
    messages$: ObservableArray<NormalizedChatMessage[]>;
    hasScrollToBottom?: boolean;
  },
) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isScrolling$ = useObservable(false);
  useStyleSheet(styleSheet);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = (e.target as HTMLDivElement).scrollTop;
    const isPinnedToBottom = scrollTop < 0;
    if (isPinnedToBottom) {
      console.log("not bottom");
      isScrolling$.set(true);
    } else {
      console.log("pinned to bottom");
      isScrolling$.set(false);
    }
  };

  const isScrolling = useSelector(() => isScrolling$.get());

  // This detects if the browser has overflow-anchor support and will pin the scroll
  // to the bottom for flex-direction: column-reverse. Need this on safari right now
  const hasOverflowAnchorSupport = window.CSS.supports("overflow-anchor: auto");

  messages$.onChange(() => {
    const isScrolling = isScrolling$.get();

    if (!hasOverflowAnchorSupport && !isScrolling) {
      window.requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  });

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="c-chat" ref={chatRef}>
      <ThemeComponent />
      {isScrolling && hasScrollToBottom
        ? (
          <div className="scroll" onClick={scrollToBottom}>
            <Icon icon={arrowDownIconPath} color="#FFFFFF" size={20} />
          </div>
        )
        : null}
      <div className="messages" ref={messagesRef} onScroll={handleScroll}>
        <div className="bottom" ref={bottomRef} />
        <For<NormalizedChatMessage, {}>
          each={messages$}
          item={ChatMessage}
          optimized
        />
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
          {badges?.map((badge) => (
            <BadgeRenderer src={badge.src} tooltip={badge.tooltip} />
          ))}
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
          {isVerified
            ? (
              <BadgeRenderer
                src={VERIFIED_CHECK_IMG_URL}
                tooltip={"Verified"}
              />
            )
            : null}
        </span>
      </span>
      <span className="separator">
        :
      </span>
      {richText}
    </div>
  );
}
