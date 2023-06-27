import { React } from "../../deps.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.11/format/wc/react/index.ts";
import ChatTab from "../../components/chat-tab/chat-tab.tsx";

function HomePage() {
  return (
    <>
      <ChatTab />
    </>
  );
}

export default toDist(HomePage, import.meta.url);
