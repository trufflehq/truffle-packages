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

const HAMBURGER_ICON_PATH = "M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z";

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
    paddingLeft: 0,
    width: 48,
    borderWidth: 0,
  };

  return (
    <div
      className={`c-extension-icon ${classKebab({ hasNotification })}`}
      style={{ ...(menuOpen && menuOpenStyles) }}
      onClick={onExtensionIconClick}
    >
      <img
        src={getSrcByImageObj(iconImageObj)}
        alt="Creator icon"
        width={menuOpen ? 48 : 40}
        height={menuOpen ? 48 : 40}
        style={{
          borderRadius: menuOpen ? 0 : 2,
          pointerEvents: "none",
        }}
      />

      {menuOpen ? null : (
        <div
          className="icon"
          style={{
            pointerEvents: "none",
            transition: "box-shadow 0.25s",
          }}
        >
          <Icon
            icon={HAMBURGER_ICON_PATH}
            size="24px"
            color="white"
            isClickable={false}
          />
        </div>
      )}

      <Ripple color="var(--mm-color-text-bg-primary)" />
    </div>
  );
}
