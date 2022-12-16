import { jumper, React, useEffect, useStyleSheet } from "../../deps.ts";
import stylesheet from "./drlupo-stjude-theme.scss.js";

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
          id: "drlupo-stjude-chat-styles",
          css: `
          :root {
            /* chat bg */
            --yt-live-chat-product-picker-hover-color: #141456 !important;
            --yt-live-chat-background-color: #141456 !important;
            --yt-live-chat-primary-text-color: #ffffff !important;
            --yt-live-chat-secondary-text-color: #eeeeee !important;

            /* context chat styles */
            --yt-live-chat-header-background-color: #15153C !important;
            --yt-live-chat-action-panel-background-color: #15153C !important;
            --yt-live-chat-message-highlight-background-color: #15153C !important;
            --yt-live-chat-ninja-message-background-color: #15153C !important;
            --yt-live-chat-vem-background-color: #15153C !important;
            --yt-live-chat-banner-gradient-scrim: #15153C !important;
            --yt-spec-menu-background: #15153C !important;
            --yt-spec-raised-background: #15153C !important;
            --yt-spec-text-primary: #ffffff !important;
          }

          yt-icon-button.yt-live-chat-item-list-renderer {
            background: #FF1A5B !important;
          }

          #item-scroller.yt-live-chat-item-list-renderer::-webkit-scrollbar-track {
            background: #15153C !important;
          }

          #action-buttons.yt-live-chat-header-renderer::before {
            content: "";
            width: 71px;
            height: 24px;
            position: absolute;
            top: 12px;
            right: 64px;
            background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/drlupo-stjude/logo.svg);
            background-size: 100%;
            background-repeat: no-repeat;
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
          id: "drlupo-stjude-chat-styles",
          css: ``,
        },
      },
    ],
  });
};

export function DrLupoStJudeChatTheme() {
  useStyleSheet(stylesheet);

  useEffect(() => {
    setJumperYoutubeChatStyles();
  }, []);

  return (
    <div className="c-drlupo-stjude-chat-theme">
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
          id: "drlupo-stjude-page-styles",
          css: `
          :root {
            /* page bg */
            --yt-spec-base-background: #0B0B1F !important;
            
            /* search bar bg */
            --ytd-searchbox-background: #0B0B1F !important;
            
            /* popup menu bg */
            --yt-spec-menu-background: #0B0B1F !important;
            
            /* dialog bg */
            --paper-dialog-background-color: #0B0B1F !important;
            
            --yt-spec-brand-background-primary: #15153C !important;

            /* hide chat bg */
            --yt-spec-touch-response: #15153C !important;
            
            /* primary buttons */
            --yt-spec-call-to-action: #FF1A5B !important;
            --yt-spec-text-primary-inverse: #ffffff !important;

            /* light bg */
            --yt-spec-badge-chip-background: #15153C !important;
            
            /* search magnifying glass */
            --ytd-searchbox-legacy-button-hover-color: #15153C !important;
            --ytd-searchbox-legacy-button-color: #15153C !important;
          }

          html[dark], [dark] {
            /* masthead bg */
            --yt-spec-base-background: #0B0B1F !important;

            /* search bar bg */
            --ytd-searchbox-background: #0B0B1F !important;

            /* masthead colors */
            --yt-spec-general-background-a: #0B0B1F !important;
            --paper-dialog-background-color: #0B0B1F !important;
            --ytd-searchbox-legacy-button-color: #15153C !important;
            --ytd-searchbox-legacy-button-hover-color: #15153C !important;
          }

          html[darker-dark-theme] {
            --paper-dialog-background-color: #0B0B1F !important;
          }

          yt-chip-cloud-chip-renderer[chip-style=STYLE_DEFAULT][selected] {
            background-color: #FF1A5B !important;
          }

          ytd-topbar-logo-renderer {
            position: relative;
          }

          ytd-masthead {
            position: relative !important;
            z-index: 1 !important;
          }

          ytd-masthead::after {
            content: "";
            width: 70%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 256px;
            right: 0;
            bottom: 0;
            background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/drlupo-stjude/long-blocks.svg);
            z-index: -1;
          }
      
          ytd-topbar-logo-renderer::after {
            content: "";
            width: 71px;
            height: 24px;
            position: absolute;
            top: 14px;
            left: 129px;
            background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/drlupo-stjude/logo.svg);
            z-index: 2;
            background-size: 100%;
            background-repeat: no-repeat;
          }        
          `,
        },
      },
    ],
    mutatedElementId: "drlupo-stjude-page-styles",
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
          id: "drlupo-stjude-page-styles",
          css: ``,
        },
      },
    ],
  });
};

export function DrLupoStJudePageTheme() {
  useStyleSheet(stylesheet);

  useEffect(() => {
      initializeMutationObserverCleanupTracking();
      setJumperYoutubePageStyles();
  }, []);

  return (
    <div className="c-drlupo-stjude-page-theme">
      <div className="background" />
    </div>
  );
}
