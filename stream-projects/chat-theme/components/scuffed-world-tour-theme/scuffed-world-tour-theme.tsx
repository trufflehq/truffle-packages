import { jumper, React, useEffect, useStyleSheet } from "../../deps.ts";
import stylesheet from "./scuffed-world-tour-theme.scss.js";

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
          id: "scuffed-world-tour-chat-styles",
          css: `
          :root {
            color-scheme: only light;
            /* chat bg */
            --yt-live-chat-product-picker-hover-color: #222222 !important;
            --yt-live-chat-background-color: #222222 !important;
            --yt-live-chat-primary-text-color: #ffffff !important;
            --yt-live-chat-secondary-text-color: #eeeeee !important;

            /* context chat styles */
            --yt-live-chat-header-background-color: #343434 !important;
            --yt-live-chat-action-panel-background-color: #343434 !important;
            --yt-live-chat-message-highlight-background-color: #343434 !important;
            --yt-live-chat-ninja-message-background-color: #343434 !important;
            --yt-live-chat-vem-background-color: #343434 !important;
            --yt-live-chat-banner-gradient-scrim: #343434 !important;
            --yt-spec-menu-background: #343434 !important;
            --yt-spec-raised-background: #343434 !important;
            
            --yt-spec-text-primary: #ffffff !important;
          }

          .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
            background: #BA3056 !important;
          }

          yt-icon-button.yt-live-chat-item-list-renderer {
            background: #BA3056 !important;
            color-scheme: only light;
          }

          #item-scroller.yt-live-chat-item-list-renderer::-webkit-scrollbar-track {
            background: #222222 !important;
          }

          #item-scroller.yt-live-chat-item-list-renderer::-webkit-scrollbar-thumb {
            background: #343434 !important;
            border: 2px solid #222222 !important;
          }

          yt-live-chat-header-renderer {
            position: relative !important;
            z-index: 1 !important;
          }

          .yt-live-chat-header-renderer::before {
            content: "";
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: -1;
            background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/scuffed-world-tour/chat_topbar_bg.png);
            background-size: 100%;
          }   
          
          yt-live-chat-message-input-renderer {
            position: relative !important;
            z-index: 1 !important;
          }

          yt-live-chat-message-input-renderer::before {
            content: "";
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: -1;
            background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/scuffed-world-tour/chat_bottombar_bg.png);
            background-size: 100%;
          }

          #items {
            background: rgba(0,0,0,0.5) !important;
          }

          yt-live-chat-text-message-renderer {
            background: rgba(34,34,34, 0.5) !important;
          }
          
          `,
        },
      },
      { action: "useSubject" },
      { action: "setStyle", value: style },
    ],
  });
};

export const onChatCleanup = () => {
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      {
        action: "setStyleSheet",
        value: {
          id: "scuffed-world-tour-chat-styles",
          css: ``,
        },
      },
    ],
  });
};

export function ScuffedWorldTourChatTheme() {
  useStyleSheet(stylesheet);

  useEffect(() => {
    setJumperYoutubeChatStyles();
  }, []);

  return (
    <div className="c-scuffed-world-tour-chat-theme">
      <div className="background" />
    </div>
  );
}

const setJumperYoutubePageStyles = () => {
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      {
        action: "setStyleSheet",
        value: {
          id: "scuffed-world-tour-page-styles",
          css: `
          :root {
            /* page bg */
            --yt-spec-base-background: #222222 !important;
            
            /* search bar bg */
            --ytd-searchbox-background: #222222 !important;
            
            /* popup menu bg */
            --yt-spec-menu-background: #222222 !important;
            
            /* dialog bg */
            --paper-dialog-background-color: #222222 !important;
            
            --yt-spec-brand-background-primary: #343434 !important;

            /* hide chat bg */
            --yt-spec-touch-response: #343434 !important;
            
            /* primary buttons */
            --yt-spec-call-to-action: #BA3056 !important;
            --yt-spec-text-primary-inverse: #ffffff !important;

            /* light bg */
            --yt-spec-badge-chip-background: #343434 !important;
            
            /* search magnifying glass */
            --ytd-searchbox-legacy-button-hover-color: #222222 !important;
            --ytd-searchbox-legacy-button-color: #222222 !important;
          }

          html[dark], [dark] {
            /* masthead bg */
            --yt-spec-base-background: #222222 !important;

            /* search bar bg */
            --ytd-searchbox-background: #222222 !important;

            /* masthead colors */
            --yt-spec-general-background-a: #222222 !important;
            --paper-dialog-background-color: #222222 !important;
            --ytd-searchbox-legacy-button-color: #343434 !important;
            --ytd-searchbox-legacy-button-hover-color: #343434 !important;
          }

          html, [light] {
            --yt-spec-wordmark-text: #ffffff !important;
            --yt-spec-text-primary: #ffffff !important;
            --ytd-searchbox-legacy-border-color: #222222 !important;
            --ytd-searchbox-legacy-border-shadow-color: #343434 !important;
            --ytd-searchbox-legacy-button-hover-border-color: #343434 !important;
            --ytd-searchbox-legacy-button-border-color: #343434 !important;
            --yt-spec-general-background-a: #343434 !important;

            --iron-icon-fill-color: #ffffff !important;
            /* --iron-icon-stroke-color: #ffffff !important; */
            --yt-spec-text-secondary: #F0ECEC	!important;
            --light-theme-base-color: #ffffff !important;
            --ytd-searchbox-text-color: #ffffff !important;
          }

          html[darker-dark-theme] {
            --paper-dialog-background-color: #222222 !important;
          }

          .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
            background: #BA3056 !important;
          }
          
          .yt-spec-button-shape-next--filled {
            background: #BA3056 !important;
          }

          yt-chip-cloud-chip-renderer[chip-style=STYLE_DEFAULT][selected] {
            background-color: #BA3056 !important;
          }

          ytd-topbar-logo-renderer {
            position: relative;
          }

          ytd-masthead {
            position: relative !important;
            z-index: 1 !important;
          }
      
          ytd-topbar-logo-renderer::after {
            content: "";
            position: absolute;
            top: 16px;
            left: 110px;
            width: 120px;
            height: 25px;
            background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/scuffed-world-tour/masthead-logo.png);
            z-index: 0;
            background-size: 100%;
            background-repeat: no-repeat;
          }   

          @media (min-width: 1300px) {
            ytd-topbar-logo-renderer::after {
              top: 12px;
              left: 129px;
              width: 165px;
              height: 33px;
            }
          }

          
          ytd-toggle-button-renderer.ytd-live-chat-frame {
            position: relative !important;
            z-index: 1 !important;
          }

          ytd-toggle-button-renderer::after {
            content: "";
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: -1;
            background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/scuffed-world-tour/chat_bottombar_bg.png);
            background-size: 100%;
          }
          `,
        },
      },
    ],
    mutatedElementId: "scuffed-world-tour-page-styles",
  });
};

function initializeMutationObserverCleanupTracking() {
  jumper.call("layout.listenForElements", {
    listenElementLayoutConfigSteps: [
      { action: "querySelector", value: "ytd-watch-metadata" },
    ],
    observerConfig: { childList: true, subtree: true },
    targetQuerySelector: "something-else-that-will-never-match",
    shouldCleanupMutatedElements: true,
  }, () => {});
}

export const onPageCleanup = () => {
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      {
        action: "setStyleSheet",
        value: {
          id: "scuffed-world-tour-page-styles",
          css: ``,
        },
      },
    ],
  });
};

export function ScuffedWorldTourPageTheme() {
  useStyleSheet(stylesheet);

  useEffect(() => {
    initializeMutationObserverCleanupTracking();
    setJumperYoutubePageStyles();
  }, []);

  return (
    <div className="c-scuffed-world-tour-page-theme">
      <div className="background" />
    </div>
  );
}
