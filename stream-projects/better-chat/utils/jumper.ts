export const setChatBgColor = (messageId, bgColor) => {
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      { action: "querySelector", value: CHAT_FRAME_ID },
      { action: "getIframeDocument" },
      { action: "querySelector", value: `[data-truffle-id="${messageId}"]` },
      {
        action: "setStyle",
        value: { background: bgColor },
      },
    ],
  });
};

export const setChatNameColor = (messageId, nameColor) => {
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      { action: "querySelector", value: CHAT_FRAME_ID },
      { action: "getIframeDocument" },
      {
        action: "querySelector",
        value:
          `[data-truffle-id="${messageId}"] > #content > yt-live-chat-author-chip > #author-name`,
      },
      {
        action: "setStyle",
        value: {
          color: nameColor,
        },
      },
    ],
  });
};

export const setChatUsernameGradient = (messageId, gradient) => {
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      { action: "querySelector", value: CHAT_FRAME_ID },
      { action: "getIframeDocument" },
      {
        action: "querySelector",
        value:
          `[data-truffle-id="${messageId}"] > #content > yt-live-chat-author-chip > #author-name`,
      },
      {
        action: "setStyle",
        value: {
          "-webkit-text-fill-color": "transparent",
          background: gradient,
          "-webkit-background-clip": "text",
          fontWeight: "bold",
        },
      },
    ],
  });
};
