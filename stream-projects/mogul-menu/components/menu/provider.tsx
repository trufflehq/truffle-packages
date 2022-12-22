import { React } from "../../deps.ts";
import { File } from "../../types/mod.ts";
import { isNative } from "../../shared/mod.ts";
import { MenuState } from "./types.ts";
import { useMenuReducer } from "./hooks.ts";
import { MenuContext } from "./context.ts";
import {
  BASE_MENU_HEIGHT,
  BASE_MENU_WIDTH,
  DEFAULT_MENU_ICON_HEIGHT,
  DEFAULT_MENU_ICON_WIDTH,
} from "./constants.ts";

export const INITIAL_DIMENSIONS = {
  base: {
    x: BASE_MENU_WIDTH,
    y: BASE_MENU_HEIGHT,
    width: DEFAULT_MENU_ICON_WIDTH,
    height: DEFAULT_MENU_ICON_HEIGHT,
  },
  modifiers: {
    transition: "none",
  },
};

export const getInitialMenuState = (): MenuState => ({
  isNative: isNative() ?? false,
  menuState: isNative() ? "open" : "closed",
  menuPosition: isNative() ? "top-left" : undefined,
  snackBars: [],
  creatorName: "",
  dimensions: INITIAL_DIMENSIONS,
});

export function MenuProvider({
  children,
  iconImageObj,
  creatorName,
}: {
  children: React.ReactNode;
  iconImageObj?: File;
  creatorName: string;
}) {
  const menuState = useMenuReducer({ ...getInitialMenuState(), iconImageObj, creatorName });
  return <MenuContext.Provider value={menuState}>{children}</MenuContext.Provider>;
}
