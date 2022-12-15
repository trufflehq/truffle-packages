import { React } from "../../deps.ts";
import { ThemeMap } from "../../shared/mod.ts";
import WatchPartyChatTheme, {
  onChatThemeCleanup as onWatchPartyChatThemeCleanup,
} from "../watch-party-theme/watch-party-theme.tsx";

import {
  DrLupoStJudeChatTheme,
  onChatCleanup as onDrLupoStJudeChatThemeCleanup,
} from "../drlupo-stjude-theme/drlupo-stjude-theme.tsx";
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
