import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import ChatTheme from "../../components/chat-theme/chat-theme.tsx";
function ChatThemePage() {
  return <ChatTheme />;
}

export default toDist(ChatThemePage, import.meta.url);
