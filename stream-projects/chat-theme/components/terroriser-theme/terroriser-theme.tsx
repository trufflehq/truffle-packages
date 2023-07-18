import { jumper, React, useEffect, useStyleSheet } from "../../deps.ts";
import stylesheet from "./terroriser-theme.scss.js";

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
          id: "terroriser-chat-styles",
          css: `
          :root {
            color-scheme: only light;
            /* chat bg */
            --yt-live-chat-product-picker-hover-color: var(--truffle-bg) !important;
            --yt-live-chat-background-color: var(--truffle-bg) !important;
            --yt-live-chat-primary-text-color: var(--truffle-bg-text) !important;
            --yt-live-chat-secondary-text-color: #eeeeee !important;

            /* context chat styles */
            --yt-live-chat-header-background-color: var(--truffle-bg-2);
            --yt-live-chat-action-panel-background-color: var(--truffle-bg) !important;
            --yt-live-chat-message-highlight-background-color: var(--truffle-bg-2);
            --yt-live-chat-ninja-message-background-color: var(--truffle-bg-2);
            --yt-live-chat-vem-background-color: var(--truffle-bg-2);
            --yt-live-chat-banner-gradient-scrim: linear-gradient(rgba(0, 0, 0, 0.95), transparent) !important;
            --yt-spec-menu-background: var(--truffle-bg-2);
            --yt-spec-raised-background: var(--truffle-bg-2);
            
            --yt-spec-text-primary: var(--truffle-bg-text) !important;
          }

          .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
            background: var(--truffle-primary) !important;
          }

          yt-icon-button.yt-live-chat-item-list-renderer {
            background: var(--truffle-primary) !important;
            color-scheme: only light;
          }

          #item-scroller.yt-live-chat-item-list-renderer::-webkit-scrollbar-track {
            background: var(--truffle-bg) !important;
          }

          #item-scroller.yt-live-chat-item-list-renderer::-webkit-scrollbar-thumb {
            background: var(--truffle-bg-2);
            border: 2px solid var(--truffle-bg) !important;
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
            /*background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/terroriser/chat_topbar_bg.png);*/
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
          id: "terroriser-chat-styles",
          css: ``,
        },
      },
    ],
  });
};

export function TerroriserChatTheme() {
  useStyleSheet(stylesheet);

  useEffect(() => {
    setJumperYoutubeChatStyles();
  }, []);

  return (
    <div className="c-terroriser-chat-theme">
      <div className="background" />
    </div>
  );
}

const colorsCss = `
:root {
  --truffle-bg: #0C0A2B;
  --truffle-bg-2: #0F0A44;
  --truffle-primary: #EA4E53;
  --truffle-bg-text: #ffffff;

  /* page bg */
  --yt-spec-base-background: var(--truffle-bg) !important;
  
  /* search bar bg */
  --ytd-searchbox-background: var(--truffle-bg) !important;
  
  /* popup menu bg */
  --yt-spec-menu-background: var(--truffle-bg) !important;
  
  /* dialog bg */
  --paper-dialog-background-color: var(--truffle-bg) !important;
  
  --yt-spec-brand-background-primary: var(--truffle-bg) !important;

  /* hide chat bg */
  --yt-spec-touch-response: var(--truffle-bg-2);
  
  /* primary buttons */
  --yt-spec-call-to-action: var(--truffle-primary) !important;
  --yt-spec-text-primary-inverse: var(--truffle-bg-text) !important;

  /* light bg */
  --yt-spec-badge-chip-background: var(--truffle-bg-2);
  
  /* search magnifying glass */
  --ytd-searchbox-legacy-button-hover-color: var(--truffle-bg) !important;
  --ytd-searchbox-legacy-button-color: var(--truffle-bg) !important;
}

html[dark], [dark] {
  /* masthead bg */
  --yt-spec-base-background: var(--truffle-bg) !important;

  /* search bar bg */
  --ytd-searchbox-background: var(--truffle-bg) !important;

  /* masthead colors */
  --yt-spec-general-background-a: var(--truffle-bg) !important;
  --paper-dialog-background-color: var(--truffle-bg) !important;
  --ytd-searchbox-legacy-button-color: var(--truffle-bg-2);
  --ytd-searchbox-legacy-button-hover-color: var(--truffle-bg-2);
}

html, [light] {
  --yt-spec-wordmark-text: var(--truffle-bg-text) !important;
  --yt-spec-text-primary: var(--truffle-bg-text) !important;
  --ytd-searchbox-legacy-border-color: var(--truffle-bg) !important;
  --ytd-searchbox-legacy-border-shadow-color: var(--truffle-bg-2);
  --ytd-searchbox-legacy-button-hover-border-color: var(--truffle-bg-2);
  --ytd-searchbox-legacy-button-border-color: var(--truffle-bg-2);
  --yt-spec-general-background-a: var(--truffle-bg-2);

  --iron-icon-fill-color: var(--truffle-bg-text) !important;
  /* --iron-icon-stroke-color: var(--truffle-bg-text) !important; */
  --yt-spec-text-secondary: #F0ECEC	!important;
  --light-theme-base-color: var(--truffle-bg-text) !important;
  --ytd-searchbox-text-color: var(--truffle-bg-text) !important;
}

html[darker-dark-theme] {
  --paper-dialog-background-color: var(--truffle-bg) !important;
}

.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
  background: var(--truffle-primary) !important;
}

.yt-spec-button-shape-next--filled {
  background: var(--truffle-primary) !important;
}

yt-chip-cloud-chip-renderer[chip-style=STYLE_DEFAULT][selected] {
  background-color: var(--truffle-primary) !important;
}`

const logoCss = `
ytd-topbar-logo-renderer {
  position: relative;
}

ytd-masthead {
  position: relative !important;
  z-index: 1 !important;
}

ytd-masthead::after {
  content: "";
  position: absolute;
  height: 100%;
  top: 0;
  left: 244px;
  right: 222px;
  background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/terroriser/ytbar_bg.svg?1);
  background-size: auto 100%;
  z-index: -1;
}

ytd-topbar-logo-renderer::after {
  content: "";
  position: absolute;
  top: 8px;
  left: 136px;
  width: 59px;
  height: 40px;
  background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/terroriser/masthead-logo.png);
  z-index: 0;
  background-size: 100%;
  background-repeat: no-repeat;
}`

const setJumperYoutubePageStyles = () => {
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      {
        action: "setStyleSheet",
        value: {
          id: "terroriser-page-styles",
          css: `
          /* fonts */
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

          html {
            font-family: 'Press Start 2P', Roboto, Arial, sans-serif !important;
            font-size: 9px !important;
          }

          yt-live-chat-text-message-renderer,
          yt-live-chat-text-input-field-renderer,
          yt-live-chat-message-input-renderer,
          yt-live-chat-viewer-engagement-message-renderer
           {
            font-size: 9px !important;
            letter-spacing: -0.9px !important;
          }

          ${''/*colorsCss*/}
          ${logoCss}

          ytd-toggle-button-renderer.ytd-live-chat-frame {
            position: relative !important;
            z-index: 1 !important;
          }`,
        },
      },
    ],
    mutatedElementId: "terroriser-page-styles",
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
          id: "terroriser-page-styles",
          css: ``,
        },
      },
    ],
  });
};

export function TerroriserPageTheme() {
  useStyleSheet(stylesheet);

  useEffect(() => {
    initializeMutationObserverCleanupTracking();
    setJumperYoutubePageStyles();
  }, []);

  return (
    <div className="c-terroriser-page-theme">
      <div className="background" />
    </div>
  );
}
