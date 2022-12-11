import { jumper } from "../../deps.ts";

import {
  BASE_MENU_STYLES,
  YOUTUBE_COLLAPSED_PORTRAIT_MENU_STYLES,
  YOUTUBE_EXPANDED_LANDSCAPE_MENU_STYLES,
  YOUTUBE_EXPANDED_PORTRAIT_MENU_STYLES,
  YOUTUBE_MENU_ORIENTATION_STYLESHEET,
} from "./styles.ts";

// FIXME: add support for sourceType so we can support youtube & twitch specific styles
export function changeFrameOrientation(
  { orientation, isCollapsed }: {
    orientation: "landscape" | "portrait" | undefined;
    isCollapsed: boolean;
  },
) {
  if (!orientation) return;
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: orientation === "landscape"
      ? isCollapsed
        ? YOUTUBE_COLLAPSED_LANDSCAPE_LAYOUT_CONFIG_STEPS
        : YOUTUBE_LANDSCAPE_LAYOUT_CONFIG_STEPS
      : isCollapsed
      ? YOUTUBE_COLLAPSED_PORTRAIT_LAYOUT_CONFIG_STEPS
      : YOUTUBE_PORTRAIT_LAYOUT_CONFIG_STEPS,
  });
}

// FIXME: add support for sourceType so we can support youtube & twitch specific styles
function getMenuStyleSteps(orientation: "landscape" | "portrait", isCollapsed: boolean) {
  return [
    { action: "useSubject" }, // start with our iframe
    {
      action: "setStyle",
      value: orientation === "portrait"
        ? isCollapsed
          ? YOUTUBE_COLLAPSED_PORTRAIT_MENU_STYLES
          : YOUTUBE_EXPANDED_PORTRAIT_MENU_STYLES
        : isCollapsed
        ? BASE_MENU_STYLES
        : YOUTUBE_EXPANDED_LANDSCAPE_MENU_STYLES,
    },
    { action: "useDocument", value: "null" },
  ];
}

export const YOUTUBE_PORTRAIT_LAYOUT_CONFIG_STEPS = [
  ...getMenuStyleSteps("portrait", false),
  { action: "querySelector", value: "body" },
  { action: "addClassNames", value: ["truffle-portrait", "truffle-portrait-open"] },
  {
    action: "removeClassNames",
    value: [
      "truffle-portrait-closed",
      "truffle-landscape-open",
      "truffle-landscape-collapsed",
      "truffle-landscape",
    ],
  },
  {
    action: "setStyleSheet",
    value: {
      id: "menu-orientation-styles",
      css: YOUTUBE_MENU_ORIENTATION_STYLESHEET,
    },
  },
];

export const YOUTUBE_COLLAPSED_PORTRAIT_LAYOUT_CONFIG_STEPS = [
  ...getMenuStyleSteps("portrait", true),
  { action: "querySelector", value: "body" },
  { action: "addClassNames", value: ["truffle-portrait", "truffle-portrait-closed"] },
  {
    action: "removeClassNames",
    value: [
      "truffle-portrait-open",
      "truffle-landscape-open",
      "truffle-landscape-collapsed",
      "truffle-landscape",
    ],
  },
  {
    action: "setStyleSheet",
    value: {
      id: "menu-orientation-styles",
      css: YOUTUBE_MENU_ORIENTATION_STYLESHEET,
    },
  },
];

export const YOUTUBE_COLLAPSED_LANDSCAPE_LAYOUT_CONFIG_STEPS = [
  ...getMenuStyleSteps("landscape", true),

  { action: "querySelector", value: "body" },
  { action: "addClassNames", value: ["truffle-landscape", "truffle-landscape-collapsed"] },
  {
    action: "removeClassNames",
    value: [
      "truffle-portrait",
      "truffle-portrait-open",
      "truffle-portrait-closed",
      "truffle-landscape-open",
    ],
  },
  {
    action: "setStyleSheet",
    value: {
      id: "menu-orientation-styles",
      css: YOUTUBE_MENU_ORIENTATION_STYLESHEET,
    },
  },
];

export const YOUTUBE_LANDSCAPE_LAYOUT_CONFIG_STEPS = [
  ...getMenuStyleSteps("landscape", false),

  { action: "querySelector", value: "body" },
  { action: "addClassNames", value: ["truffle-landscape", "truffle-landscape-open"] },
  {
    action: "removeClassNames",
    value: [
      "truffle-portrait",
      "truffle-portrait-open",
      "truffle-portrait-closed",
      "truffle-landscape-collapsed",
    ],
  },
  {
    action: "setStyleSheet",
    value: {
      id: "menu-orientation-styles",
      css: YOUTUBE_MENU_ORIENTATION_STYLESHEET,
    },
  },
];
