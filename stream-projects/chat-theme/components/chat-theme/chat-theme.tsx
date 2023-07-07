import { React } from "../../deps.ts";
import { ThemeMap } from "../../shared/mod.ts";
import WatchPartyChatTheme, {
  onChatThemeCleanup as onWatchPartyChatThemeCleanup,
} from "../watch-party-theme/watch-party-theme.tsx";

import {
  DrLupoStJudeChatTheme,
  onChatCleanup as onDrLupoStJudeChatThemeCleanup,
} from "../drlupo-stjude-theme/drlupo-stjude-theme.tsx";
import {
  onChatCleanup as onScuffedWorldTourChatThemeCleanup,
  ScuffedWorldTourChatTheme,
} from "../scuffed-world-tour-theme/scuffed-world-tour-theme.tsx";
import {
  LudwigTarikChatTheme,
  onChatCleanup as onLudwigTarikChatThemeCleanup,
} from "../ludwig-tarik-theme/ludwig-tarik-theme.tsx";
import {
  LacsChatTheme,
  onChatCleanup as onLacsChatThemeCleanup,
} from "../lacs-theme/lacs-theme.tsx";
import {
  TerroriserChatTheme,
  onChatCleanup as onTerroriserChatThemeCleanup,
} from "../terroriser-theme/terroriser-theme.tsx";
import { AlertTheme } from "../alert-theme/alert-theme.tsx";

export const ALERT_CHAT_THEMES: ThemeMap = {
  "watch-party": {
    Component: WatchPartyChatTheme,
    onCleanup: onWatchPartyChatThemeCleanup,
  },
  "drlupo-stjude": {
    Component: DrLupoStJudeChatTheme,
    onCleanup: onDrLupoStJudeChatThemeCleanup,
  },
  "scuffed-world-tour-theme": {
    Component: ScuffedWorldTourChatTheme,
    onCleanup: onScuffedWorldTourChatThemeCleanup,
  },
  "ludwig-tarik-theme": {
    Component: LudwigTarikChatTheme,
    onCleanup: onLudwigTarikChatThemeCleanup,
  },
  "lacs-theme": {
    Component: LacsChatTheme,
    onCleanup: onLacsChatThemeCleanup,
  },
  "terroriser-theme": {
    Component: TerroriserChatTheme,
    onCleanup: onTerroriserChatThemeCleanup,
  },
};

function ChatTheme(
  { themes = ALERT_CHAT_THEMES, alertTypes = ["watch-party"] }: {
    themes?: ThemeMap;
    alertTypes?: string[];
  },
) {
  return <AlertTheme themes={themes} alertTypes={alertTypes} />;
}

export default ChatTheme;
