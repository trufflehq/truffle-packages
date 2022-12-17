import { jumper, React, useEffect, useStyleSheet } from "../../deps.ts";
import DiscoBall from "./disco-ball/disco-ball.tsx";
import Sparkles from "./sparkles/sparkles.tsx";
import stylesheet from "./watch-party-theme.scss.js";

const setJumperYoutubeChatStyles = () => {
  const style = {
    width: "100%",
    height: "100%",
    background: "transparent",
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    "pointer-events": "none",
    "z-index": "-1",
  };
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      {
        action: "setStyleSheet",
        value: {
          id: "watch-party-styles",
          css: `
          :root {
            color-scheme: only light;
            --yt-live-chat-product-picker-hover-color: #232255 !important;
            --yt-live-chat-background-color: #232255 !important;
            --yt-live-chat-primary-text-color: #ffffff !important;
            --yt-live-chat-secondary-text-color: #eeeeee !important;
            --yt-live-chat-header-background-color: #020226 !important;
            --yt-live-chat-action-panel-background-color: #020226 !important;
            --yt-live-chat-message-highlight-background-color: #232255 !important;
            --yt-live-chat-ninja-message-background-color: #020226 !important;
            --yt-live-chat-vem-background-color: #020226 !important;
            --yt-live-chat-banner-gradient-scrim: linear-gradient(rgba(0, 0, 0, 0.95), transparent) !important;
            --yt-spec-menu-background: #020226 !important;
            --yt-spec-raised-background: #020226 !important;
            --yt-spec-text-primary: #ffffff !important;
          }

          #item-scroller.yt-live-chat-item-list-renderer::-webkit-scrollbar-track {
            background: #232255 !important;
          }

          #action-buttons.yt-live-chat-header-renderer::before {
            content: "";
            width: 141px;
            height: 24px;
            position: absolute;
            top: 12px;
            left: 50%;
            background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/watch-party/watch-party-logosvg.svg);
            background-size: 100%;
            background-repeat: no-repeat;
            z-index: 0;
          }        
          `,
        },
      },
      { action: "useSubject" },
      { action: "setStyle", value: style },
    ],
  });
};

export const onChatThemeCleanup = () => {
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      {
        action: "setStyleSheet",
        value: {
          id: "watch-party-styles",
          css: ``,
        },
      },
    ],
  });
};

export default function WatchPartyChatTheme(
  { sourceType = "youtube" }: { sourceType?: "youtube" | "twitch" },
) {
  useStyleSheet(stylesheet);
  useEffect(() => {
    if (sourceType === "youtube") {
      setJumperYoutubeChatStyles();
    }
  }, []);

  return (
    <div className="c-watch-party-chat-theme">
      <Sparkles>
        <div className="background" />
      </Sparkles>
      <DiscoBall />
    </div>
  );
}
