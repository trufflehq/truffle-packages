import { jumper, React, useEffect, useStyleSheet } from "../../deps.ts";
import DiscoBall from "../disco-ball/disco-ball.tsx";
import Sparkles from "../sparkles/sparkles.tsx";
import stylesheet from "./watch-party-theme.scss.js";

const setJumperYoutubeStyles = () => {
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
    "z-index": "1",
  };
  // set styles for this iframe within YouTube's site
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      {
        action: "setStyleSheet",
        value: {
          id: "watch-party-styles",
          css: `
          /* TODO see if we can just override the yt css vars */
          #chat.yt-live-chat-renderer {
            background: #232255 !important;
          }

          yt-live-chat-banner-manager[has-active-banner] {
            background: #232255 !important;
          }

          yt-live-chat-text-message-renderer[author-is-owner] {
            background: #232255 !important;
          }

          yt-live-chat-header-renderer {
            background: #020226 !important;
          }

          #items.yt-live-chat-ticker-renderer {
            background: #020226 !important;
          }

          yt-live-chat-message-input-renderer {
            background: #020226 !important;
          }
          #container.yt-live-chat-restricted-participation-renderer {
            background: #020226 !important;
          }
          #item-scroller.yt-live-chat-item-list-renderer::-webkit-scrollbar-track {
            background: #232255 !important;
          }

          #card.yt-live-chat-viewer-engagement-message-renderer {
            background: #020226 !important;
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

          }
        
          `,
        },
      },
      { action: "useSubject" }, // start with our iframe
      { action: "setStyle", value: style },
    ],
  });
};

export default function WatchPartyTheme(
  { sourceType = "youtube" }: { sourceType?: "youtube" | "twitch" },
) {
  console.log("sourceType", sourceType);
  useStyleSheet(stylesheet);
  useEffect(() => {
    setJumperYoutubeStyles();
  }, []);

  return (
    <div className="c-watch-party-theme">
      <Sparkles>
        <div className="background" />
      </Sparkles>
      <DiscoBall />
    </div>
  );
}
