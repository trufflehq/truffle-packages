import {
  classKebab,
  getSrcByImageObj,
  Icon,
  React,
  Ripple,
  useStyleSheet,
} from "../../../deps.ts";
import { getHasNotification, useTabs } from "../../tabs/mod.ts";
import { getIsOpen, getMenuIconImageObj, useMenu } from "../mod.ts";
import stylesheet from "./extension-icon.scss.js";
import { DEFAULT_MENU_ICON_HEIGHT } from "../constants.ts";

const HAMBURGER_ICON_PATH = "M2.5 15H17.5V13.3333H2.5V15ZM2.5 10.8333H17.5V9.16667H2.5V10.8333ZM2.5 5V6.66667H17.5V5H2.5Z";

export default function ExtensionIcon() {
  const { state: menuState, toggleOpen } = useMenu();
  const { state: tabsState } = useTabs();

  const hasNotification = getHasNotification(tabsState);
  const menuOpen = getIsOpen(menuState);

  const onExtensionIconClick = () => {
    toggleOpen();
  };

  useStyleSheet(stylesheet);
  const iconImageObj = getMenuIconImageObj(menuState);

  const menuOpenStyles = {
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
      style={{ ...(menuOpen && menuOpenStyles) }}
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
          borderRadius: menuOpen ? 0 : 2,
          pointerEvents: "none",
        }}
      />
      <Ripple color="var(--mm-color-text-bg-primary)" />
    </div>
  );
}
