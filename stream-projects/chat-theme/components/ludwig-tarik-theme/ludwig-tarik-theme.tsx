import { jumper, React, useEffect, useStyleSheet } from "../../deps.ts";
import stylesheet from "./ludwig-tarik-theme.scss.js";

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
          id: "ludwig-tarik-chat-styles",
          css: `
          :root {
            color-scheme: only light;
            /* chat bg */
            --yt-live-chat-product-picker-hover-color: #0C0A2B !important;
            --yt-live-chat-background-color: #0C0A2B !important;
            --yt-live-chat-primary-text-color: #ffffff !important;
            --yt-live-chat-secondary-text-color: #eeeeee !important;

            /* context chat styles */
            --yt-live-chat-header-background-color: #0F0A44 !important;
            --yt-live-chat-action-panel-background-color: #0C0A2B !important;
            --yt-live-chat-message-highlight-background-color: #0F0A44 !important;
            --yt-live-chat-ninja-message-background-color: #0F0A44 !important;
            --yt-live-chat-vem-background-color: #0F0A44 !important;
            --yt-live-chat-banner-gradient-scrim: linear-gradient(rgba(0, 0, 0, 0.95), transparent) !important;
            --yt-spec-menu-background: #0F0A44 !important;
            --yt-spec-raised-background: #0F0A44 !important;
            
            --yt-spec-text-primary: #ffffff !important;
          }

          .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
            background: #EA4E53 !important;
          }

          yt-icon-button.yt-live-chat-item-list-renderer {
            background: #EA4E53 !important;
            color-scheme: only light;
          }

          #item-scroller.yt-live-chat-item-list-renderer::-webkit-scrollbar-track {
            background: #0C0A2B !important;
          }

          #item-scroller.yt-live-chat-item-list-renderer::-webkit-scrollbar-thumb {
            background: #0F0A44 !important;
            border: 2px solid #0C0A2B !important;
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
            /*background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/ludwig-tarik/chat_topbar_bg.png);*/
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
          id: "ludwig-tarik-chat-styles",
          css: ``,
        },
      },
    ],
  });
};

export function LudwigTarikChatTheme() {
  useStyleSheet(stylesheet);

  useEffect(() => {
    setJumperYoutubeChatStyles();
  }, []);

  return (
    <div className="c-ludwig-tarik-chat-theme">
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
          id: "ludwig-tarik-page-styles",
          css: `
          :root {
            /* page bg */
            --yt-spec-base-background: #0C0A2B !important;
            
            /* search bar bg */
            --ytd-searchbox-background: #0C0A2B !important;
            
            /* popup menu bg */
            --yt-spec-menu-background: #0C0A2B !important;
            
            /* dialog bg */
            --paper-dialog-background-color: #0C0A2B !important;
            
            --yt-spec-brand-background-primary: #0C0A2B !important;

            /* hide chat bg */
            --yt-spec-touch-response: #0F0A44 !important;
            
            /* primary buttons */
            --yt-spec-call-to-action: #EA4E53 !important;
            --yt-spec-text-primary-inverse: #ffffff !important;

            /* light bg */
            --yt-spec-badge-chip-background: #0F0A44 !important;
            
            /* search magnifying glass */
            --ytd-searchbox-legacy-button-hover-color: #0C0A2B !important;
            --ytd-searchbox-legacy-button-color: #0C0A2B !important;
          }

          html[dark], [dark] {
            /* masthead bg */
            --yt-spec-base-background: #0C0A2B !important;

            /* search bar bg */
            --ytd-searchbox-background: #0C0A2B !important;

            /* masthead colors */
            --yt-spec-general-background-a: #0C0A2B !important;
            --paper-dialog-background-color: #0C0A2B !important;
            --ytd-searchbox-legacy-button-color: #0F0A44 !important;
            --ytd-searchbox-legacy-button-hover-color: #0F0A44 !important;
          }

          html, [light] {
            --yt-spec-wordmark-text: #ffffff !important;
            --yt-spec-text-primary: #ffffff !important;
            --ytd-searchbox-legacy-border-color: #0C0A2B !important;
            --ytd-searchbox-legacy-border-shadow-color: #0F0A44 !important;
            --ytd-searchbox-legacy-button-hover-border-color: #0F0A44 !important;
            --ytd-searchbox-legacy-button-border-color: #0F0A44 !important;
            --yt-spec-general-background-a: #0F0A44 !important;

            --iron-icon-fill-color: #ffffff !important;
            /* --iron-icon-stroke-color: #ffffff !important; */
            --yt-spec-text-secondary: #F0ECEC	!important;
            --light-theme-base-color: #ffffff !important;
            --ytd-searchbox-text-color: #ffffff !important;
          }

          html[darker-dark-theme] {
            --paper-dialog-background-color: #0C0A2B !important;
          }

          .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
            background: #EA4E53 !important;
          }
          
          .yt-spec-button-shape-next--filled {
            background: #EA4E53 !important;
          }

          yt-chip-cloud-chip-renderer[chip-style=STYLE_DEFAULT][selected] {
            background-color: #EA4E53 !important;
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
            position: absolute;
            height: 100%;
            top: 0;
            left: 244px;
            right: 222px;
            background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/ludwig-tarik/ytbar_bg.svg?1);
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
            background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/ludwig-tarik/masthead-logo.png);
            z-index: 0;
            background-size: 100%;
            background-repeat: no-repeat;
          }   

          ytd-toggle-button-renderer.ytd-live-chat-frame {
            position: relative !important;
            z-index: 1 !important;
          }`,
        },
      },
    ],
    mutatedElementId: "ludwig-tarik-page-styles",
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
          id: "ludwig-tarik-page-styles",
          css: ``,
        },
      },
    ],
  });
};

export function LudwigTarikPageTheme() {
  useStyleSheet(stylesheet);

  useEffect(() => {
    initializeMutationObserverCleanupTracking();
    setJumperYoutubePageStyles();
  }, []);

  return (
    <div className="c-ludwig-tarik-page-theme">
      <div className="background" />
    </div>
  );
}
