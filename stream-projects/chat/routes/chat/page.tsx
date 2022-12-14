import React from "https://npm.tfl.dev/react";
import { useObservable, useSelector } from "../../deps.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP

import YoutubeChat from "../../components/youtube-chat/youtube-chat.tsx";

const iconImageObj = {
  id: "f38e1f40-fe27-11ec-8613-c8d0b98b6415",
  cdn: "cdn.bio",
  data: {
    name: "extension_icon.png",
    aspectRatio: 1,
    width: 756,
    height: 756,
    length: 759469,
  },
  prefix:
    "file/094ee050-61d3-11eb-ae77-b305acd7f0af/f38e1f40-fe27-11ec-8613-c8d0b98b6415",
  ext: "png",
  contentType: "image/png",
  type: "image",
  variations: [
    { postfix: ".tiny", width: 144, height: 144 },
    {
      postfix: ".small",
      width: 256,
      height: 256,
    },
    { postfix: ".large", width: 1024, height: 1024 },
  ],
};

function HomePage() {
  return (
    <>
      <YoutubeChat
        // visibleBanners={[
        //   <TestBanner />,
        //   <TestBanner />,
        // ]}
        hasChatInput
        hasScrollToBottom
        inputControls={
          <>
            <button>click me</button>
          </>
        }
      />
    </>
  );
}

function TestBanner() {
  const isOpen$ = useObservable(true);

  const isOpen = useSelector(() => isOpen$.get());

  const onClose = () => {
    isOpen$.set(false);
  };

  return (
    <div
      className="banner"
      style={{
        display: isOpen ? "flex" : "none",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px",
        boxSizing: "border-box",
        backgroundColor: "red",
        width: "100%",
        height: "40px",
        fontFamily: "Inter",
      }}
    >
      <div>Test</div>
      <button onClick={onClose}>close</button>
    </div>
  );
}

export default toDist(HomePage, import.meta.url);
