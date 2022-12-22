import { MenuState } from "./types.ts";
import {
  BASE_MENU_HEIGHT,
  BASE_MENU_WIDTH,
  DEFAULT_MENU_ICON_HEIGHT,
  DEFAULT_MENU_ICON_WIDTH,
} from "./constants.ts";
import { isNative } from "../../shared/mod.ts";

import { MenuPosition } from "./types.ts";

export function getDimensions(state: MenuState) {
  return state.dimensions;
}

export function getMenuState(state: MenuState) {
  return state.menuState;
}

export function getIsOpen(state: MenuState) {
  return state.menuState === "open";
}

export function getSnackBars(state: MenuState) {
  return state.snackBars;
}

export function getTopSnackbar(state: MenuState) {
  return state.snackBars?.[0];
}

export function getMenuIconImageObj(state: MenuState) {
  return state.iconImageObj;
}

export function getCreatorName(state: MenuState) {
  return state.creatorName;
}

export function getMenuPosition(state: MenuState) {
  return state.isNative ?  "top-left" : state.menuPosition;
}

export function getModifiersByPosition(position?: MenuPosition) {
  const modifier = position === "bottom-right"
    ? {
      top: 0 - DEFAULT_MENU_ICON_HEIGHT,
      right: 0,
      bottom: 0 - BASE_MENU_HEIGHT,
      left: 0 - BASE_MENU_WIDTH + DEFAULT_MENU_ICON_WIDTH,
    }
    : position === "bottom-left"
    ? {
      top: 0 - DEFAULT_MENU_ICON_HEIGHT,
      right: 0 - BASE_MENU_WIDTH + DEFAULT_MENU_ICON_WIDTH,
      bottom: 0 - BASE_MENU_HEIGHT,
      left: 0,
    }
    : position === "top-right"
    ? {
      top: 0 - BASE_MENU_HEIGHT,
      right: 0,
      bottom: 0 - BASE_MENU_HEIGHT + DEFAULT_MENU_ICON_HEIGHT,
      left: 0 - BASE_MENU_WIDTH + DEFAULT_MENU_ICON_WIDTH,
    }
    : position === "top-left"
    ? {
      top: 0 - BASE_MENU_HEIGHT,
      right: 0 - BASE_MENU_WIDTH + DEFAULT_MENU_ICON_WIDTH,
      bottom: 0 - BASE_MENU_HEIGHT + DEFAULT_MENU_ICON_HEIGHT,
      left: 0,
    }
    : { // default to not show the closed menu if a menuPosition isn't set, this allows us to initialize anywhere without the icon
      // jumping across the screen
      top: 0 - BASE_MENU_HEIGHT,
      right: 0 - BASE_MENU_WIDTH,
      bottom: 0 - BASE_MENU_HEIGHT,
      left: 0,
    };

  return modifier;
}
export function getClosedModifiers(state: MenuState) {
  const position = getMenuPosition(state);
  return getModifiersByPosition(position);
}

export function getOpenModifiers(state: MenuState) {
  const position = getMenuPosition(state);
  const prefix = getPositionPrefix(position);
  return prefix === "bottom"
    ? {
      top: 0 - BASE_MENU_HEIGHT,
      right: 0,
      bottom: 0 - BASE_MENU_HEIGHT,
      left: 0,
    }
    : {
      top: 0 - BASE_MENU_HEIGHT,
      right: 0,
      bottom: 0,
      left: 0,
    };
}

export function getPositionPrefix(position?: MenuPosition) {
  return position?.slice(0, position?.indexOf("-"));
}

export function getPositionSuffix(position?: MenuPosition) {
  return position?.slice(position?.indexOf("-") + 1);
}
