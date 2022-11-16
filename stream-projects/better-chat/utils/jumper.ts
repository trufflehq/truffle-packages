import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";

export const setChatBgColor = (messageId, bgColor) => {
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      { action: "querySelector", value: "#chatframe" },
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
      { action: "querySelector", value: "#chatframe" },
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
      { action: "querySelector", value: "#chatframe" },
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
