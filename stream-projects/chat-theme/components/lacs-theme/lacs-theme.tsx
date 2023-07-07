import { jumper, React, useEffect, useStyleSheet } from "../../deps.ts";
import stylesheet from "./lacs-theme.scss.js";

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
          id: "lacs-chat-styles",
          css: `
          :root {
            color-scheme: only light;
            /* chat bg */
            --yt-live-chat-product-picker-hover-color: #0F0F0F !important;
            --yt-live-chat-background-color: #0F0F0F !important;
            --yt-live-chat-primary-text-color: #ffffff !important;
            --yt-live-chat-secondary-text-color: #eeeeee !important;

            /* context chat styles */
            --yt-live-chat-header-background-color: #222222 !important;
            --yt-live-chat-action-panel-background-color: #0F0F0F !important;
            --yt-live-chat-message-highlight-background-color: #222222 !important;
            --yt-live-chat-ninja-message-background-color: #222222 !important;
            --yt-live-chat-vem-background-color: #222222 !important;
            --yt-live-chat-banner-gradient-scrim: linear-gradient(rgba(0, 0, 0, 0.95), transparent) !important;
            --yt-spec-menu-background: #222222 !important;
            --yt-spec-raised-background: #222222 !important;
            
            --yt-spec-text-primary: #ffffff !important;
          }

          .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
            background: #D8F205 !important;
          }

          yt-icon-button.yt-live-chat-item-list-renderer {
            background: #D8F205 !important;
            color-scheme: only light;
          }

          #item-scroller.yt-live-chat-item-list-renderer::-webkit-scrollbar-track {
            background: #0F0F0F !important;
          }

          #item-scroller.yt-live-chat-item-list-renderer::-webkit-scrollbar-thumb {
            background: #222222 !important;
            border: 2px solid #0F0F0F !important;
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
            /*background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/lacs/chat_topbar_bg.png);*/
            background-size: 100%;
          }   
          
          yt-live-chat-message-input-renderer {
            position: relative !important;
            z-index: 1 !important;
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
          id: "lacs-chat-styles",
          css: ``,
        },
      },
    ],
  });
};

export function LacsChatTheme() {
  useStyleSheet(stylesheet);

  useEffect(() => {
    setJumperYoutubeChatStyles();
  }, []);

  return (
    <div className="c-lacs-chat-theme">
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
          id: "lacs-page-styles",
          css: `
          :root {
            /* page bg */
            --yt-spec-base-background: #0F0F0F !important;
            
            /* search bar bg */
            --ytd-searchbox-background: #0F0F0F !important;
            
            /* popup menu bg */
            --yt-spec-menu-background: #0F0F0F !important;
            
            /* dialog bg */
            --paper-dialog-background-color: #0F0F0F !important;
            
            --yt-spec-brand-background-primary: #0F0F0F !important;

            /* hide chat bg */
            --yt-spec-touch-response: #222222 !important;
            
            /* primary buttons */
            --yt-spec-call-to-action: #D8F205 !important;
            --yt-spec-text-primary-inverse: #000000 !important;

            /* light bg */
            --yt-spec-badge-chip-background: #222222 !important;
            
            /* search magnifying glass */
            --ytd-searchbox-legacy-button-hover-color: #0F0F0F !important;
            --ytd-searchbox-legacy-button-color: #0F0F0F !important;
          }

          html[dark], [dark] {
            /* masthead bg */
            --yt-spec-base-background: #0F0F0F !important;

            /* search bar bg */
            --ytd-searchbox-background: #0F0F0F !important;

            /* masthead colors */
            --yt-spec-general-background-a: #0F0F0F !important;
            --paper-dialog-background-color: #0F0F0F !important;
            --ytd-searchbox-legacy-button-color: #222222 !important;
            --ytd-searchbox-legacy-button-hover-color: #222222 !important;
          }

          html, [light] {
            --yt-spec-wordmark-text: #ffffff !important;
            --yt-spec-text-primary: #ffffff !important;
            --ytd-searchbox-legacy-border-color: #0F0F0F !important;
            --ytd-searchbox-legacy-border-shadow-color: #222222 !important;
            --ytd-searchbox-legacy-button-hover-border-color: #222222 !important;
            --ytd-searchbox-legacy-button-border-color: #222222 !important;
            --yt-spec-general-background-a: #222222 !important;

            --iron-icon-fill-color: #ffffff !important;
            /* --iron-icon-stroke-color: #ffffff !important; */
            --yt-spec-text-secondary: #F0ECEC	!important;
            --light-theme-base-color: #ffffff !important;
            --ytd-searchbox-text-color: #ffffff !important;
          }

          html[darker-dark-theme] {
            --paper-dialog-background-color: #0F0F0F !important;
          }

          .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
            background: #D8F205 !important;
          }
          
          .yt-spec-button-shape-next--filled {
            background: #D8F205 !important;
          }

          yt-chip-cloud-chip-renderer[chip-style=STYLE_DEFAULT][selected] {
            background-color: #D8F205 !important;
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
            left: 124px;
            width: 94px;
            height: 28px;
            background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/lacs/masthead-logo.svg?1);
            z-index: 0;
            background-size: auto 100%;
            background-repeat: no-repeat;
            background-position: center right;
            border-left: 1px solid rgba(255, 255, 255, 0.24);
          }   

          ytd-toggle-button-renderer.ytd-live-chat-frame {
            position: relative !important;
            z-index: 1 !important;
          }
          
          ytd-live-chat-frame {
            border: 1px solid #D8F205 !important;
          }
          
          #related::before {
            content: "";
            width: 100%;
            height: 18px;
            background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/lacs/presented-by.svg);
            background-size: auto 100%;
            background-repeat: no-repeat;
            background-position: center;
            display: block;
            margin-bottom: 20px;
            margin-top: -12px;
          }
          `,
        },
      },
    ],
    mutatedElementId: "lacs-page-styles",
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
          id: "lacs-page-styles",
          css: ``,
        },
      },
    ],
  });
};

export function LacsPageTheme() {
  useStyleSheet(stylesheet);

  useEffect(() => {
    initializeMutationObserverCleanupTracking();
    setJumperYoutubePageStyles();
  }, []);

  return (
    <div className="c-lacs-page-theme">
      <div className="background" />
    </div>
  );
}
