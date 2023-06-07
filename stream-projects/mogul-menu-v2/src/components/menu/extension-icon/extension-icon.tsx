import {
  classKebab,
  getSrcByImageObj,
  Icon,
  React,
  Ripple,
  useStyleSheet,
} from "../../../deps.ts";
import { getHasNotification, useTabs } from "../../tabs/mod.ts";
import {getIsOpen, getMenuIconImageObj, getMenuPosition, useMenu} from "../mod.ts";
import stylesheet from "./extension-icon.scss.js";
import { DEFAULT_MENU_ICON_HEIGHT } from "../constants.ts";

const HAMBURGER_ICON_PATH = "M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z";

export default function ExtensionIcon() {
  const { state: menuState, toggleOpen } = useMenu();
  const { state: tabsState } = useTabs();

  const hasNotification = getHasNotification(tabsState);
  const menuOpen = getIsOpen(menuState);
  const position = getMenuPosition(menuState);

  const onExtensionIconClick = () => {
    toggleOpen();
  };

  useStyleSheet(stylesheet);
  const iconImageObj = getMenuIconImageObj(menuState);

  const extensionIconMenuOpenStyles = {
    justifyContent: "space-between",
    alignItems: "left",
    paddingRight: 0,
    width: DEFAULT_MENU_ICON_HEIGHT,
    borderWidth: 0,
    border: "none"
  };

  return (
    <div
      className={`c-extension-icon ${classKebab({ hasNotification })}`}
      style={{ ...(menuOpen && extensionIconMenuOpenStyles) }}
      onClick={onExtensionIconClick}
    >
      {menuOpen ? null : (
          <div
              style={{
                pointerEvents: "none",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
          >
            <Icon
                icon={HAMBURGER_ICON_PATH}
                size="20px"
                color="white"
                isClickable={false}
            />
          </div>
      )}


      <img
        src={getSrcByImageObj(iconImageObj)}
        alt="Creator icon"
        width={menuOpen ? DEFAULT_MENU_ICON_HEIGHT : 32}
        height={menuOpen ? DEFAULT_MENU_ICON_HEIGHT : 32}
        style={{
          borderTopLeftRadius: menuOpen && position !== "top-left" ? 0 : 4,
          borderTopRightRadius: menuOpen && position !== "top-right" ? 0 : 4,
          borderBottomLeftRadius: menuOpen && position !== "bottom-left" ? 0 : 4,
          borderBottomRightRadius: menuOpen && position !== "bottom-right" ? 0 : 4,
          pointerEvents: "none",
        }}
      />
      <Ripple color="var(--mm-color-text-bg-primary)" />
    </div>
  );
}
