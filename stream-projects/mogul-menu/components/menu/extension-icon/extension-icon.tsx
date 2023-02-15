import {
    classKebab,
    getSrcByImageObj, jumper,
    React,
    Ripple, useEffect, useState,
    useStyleSheet,
} from "../../../deps.ts";
import { getHasNotification, useTabs } from "../../tabs/mod.ts";
import { getMenuIconImageObj, useMenu, getIsOpen } from "../mod.ts";
import stylesheet from "./extension-icon.scss.js";
import hamburgerIcon from "../../../assets/hamburgerIcon.png";

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
        justifyContent: 'space-between',
        alignItems: 'left',
        paddingLeft: 0,
        width: 48,
        borderWidth: 0
    }

    return (
      <div
          className={`c-extension-icon ${classKebab({ hasNotification })}`}
          style={{...(menuOpen && menuOpenStyles)}}
          onClick={onExtensionIconClick}
      >
          <img
              src={getSrcByImageObj(iconImageObj)}
              alt="Creator icon"
              width={menuOpen ? 48 : 40}
              height={menuOpen ? 48 : 40}
              style={{
                  borderRadius: menuOpen ? 0 : 2,
                  pointerEvents: "none"
              }}
          />
          {menuOpen ? null :
              <img
                  src={hamburgerIcon}
                  alt="Hamburger icon"
                  width={18}
                  height={12}
                  style={{
                      pointerEvents: "none",
                      transition: "box-shadow 0.25s"
                  }}
              />
          }
          <Ripple color="var(--mm-color-text-bg-primary)" />
      </div>
    );
}
