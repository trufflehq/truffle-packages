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
// as long as they're reasonably close to the bottom, we can treat it like they're at the bottom
// (to account for rubberbanding). can potentially lower this #
const SCROLL_BOTTOM_BUFFER = 30;

export default function Chat(
  { messages$, hasScrollToBottom = false }: {
    messages$: ObservableArray<NormalizedChatMessage[]>;
    hasScrollToBottom?: boolean;
  },
) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const isScrolling$ = useObservable(false);
  useStyleSheet(styleSheet);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = (e.target as HTMLDivElement).scrollTop;
    const isPinnedToBottom = scrollTop < -1 * SCROLL_BOTTOM_BUFFER;
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
  // to the bottom for flex-direction: column-reverse. Need this on safari right now.
  const hasOverflowAnchorSupport = window.CSS.supports("overflow-anchor: auto");

  // TODO: we may want to move this to useLayoutEffect
  messages$.onChange(() => {
    const isScrolling = isScrolling$.get();

    if (!hasOverflowAnchorSupport && !isScrolling) {
      window.requestAnimationFrame(() => {
        scrollToBottom();
        // HACK: waiting for requestAnimationFrame doesn't seem like enough to guarantee it has rendered
        // some messages seem to take a little longer
        setTimeout(() => scrollToBottom(), 10);
      });
    }
  });

  function scrollToBottom() {
    // ios sucks and there's a weird bug with flex-direction: column-reverse
    // where messagesRef.current.scrollTop will technically scroll to the bottom,
    // but the element won't repaint, so it'll look like chat is stuck until you
    // use your finger to scroll. any combination of transforms, window.getComputedStyle,
    // etc... to try to get it to repaint did not work, however this does...
    if (messagesRef.current) {
      messagesRef.current.scrollTop = -1;
      messagesRef.current.scrollTop = 0;
    }
  }

  return (
    <div className="c-chat" ref={chatRef}>
      <ThemeComponent />
      {isScrolling && hasScrollToBottom
        ? (
          <div className="scroll" onClick={scrollToBottom}>
            <div className="icon">
              <Icon icon={arrowDownIconPath} color="#FFFFFF" size={20} />
            </div>
          </div>
        )
        : null}
      <div className="messages" ref={messagesRef} onScroll={handleScroll}>
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
