import {
  getClient as _getClient,
  jumper,
  Memo,
  React,
  useEffect,
  useStyleSheet,
  YoutubeChat,
} from "../../deps.ts";
import { getYoutubeVideoId } from "https://tfl.dev/@truffle/chat@0.0.15/shared/truffle/utils.ts";
import ChannelPoints from "../channel-points/channel-points.tsx";
import styleSheet from "./chat-tab.scss.js";
import { ActivityBannerEmbed, AlertBanner, PollBanner } from "../../components/activities/mod.ts";

export default function ChatTab() {
  useStyleSheet(styleSheet);

  useHiddenWebviewForChat();

  const onSend = (text: string) => {
    jumper.call("comms.postMessage", {
      type: "youtubeChatMessage",
      text,
    });
  };

  const banners = {
    poll: PollBanner,
    alert: AlertBanner,
  };

  return (
    <Memo>
      {/* <iframe
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        src="https://local-chat.rileymiller.dev/chat"
      /> */}
      <YoutubeChat
        visibleBanners={[
          <ActivityBannerEmbed banners={banners} isStandalone={false} />,
        ]}
        onSend={onSend}
        hasChatInput
        hasScrollToBottom
        inputControls={
          <ChannelPoints
            highlightButtonBg="var(--mm-gradient)"
            isStandalone={false}
            style="expanded"
          />
        }
      />
    </Memo>
  );
}

function useHiddenWebviewForChat() {
  useEffect(() => {
    jumper.call("context.getInfo").then((extensionInfo) => {
      const youtubeVideoId = extensionInfo && getYoutubeVideoId(extensionInfo.pageInfo);
      if (youtubeVideoId) {
        // TODO: could be sweet to have a way to direct which parent jumper calls should go to
        // eg setting an id here and being able to target this window for jumper calls.
        // maybe makes things too complicated though? and maybe just specific to this use-case
        jumper.call("browser.openWindow", {
          id: "youtube-chat-do-not-change-me", // don't change. hardcoded in native
          url: `https://www.youtube.com/live_chat?is_popout=1&v=${youtubeVideoId}`,
          options: { isHidden: true },
        });
      } else {
        console.warn("Video id not found");
      }
    });

    return () => {
      jumper.call("browser.closeWindow", { id: "hidden-youtube-chat" });
    };
  }, []);
}
