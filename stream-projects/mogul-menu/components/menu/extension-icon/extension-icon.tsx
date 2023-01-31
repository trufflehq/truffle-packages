import {
  classKebab,
  getSrcByImageObj,
  React,
  Ripple,
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

  return (
    <div
        className={`c-extension-icon ${classKebab({ hasNotification })}`}
        style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 4,
            width: menuOpen ? 48 : 92

        }}
        onClick={onExtensionIconClick}
    >
        <img
            src={getSrcByImageObj(iconImageObj)}
            alt="Creator icon"
            width={40}
            height={40}
            style={{
                borderRadius: 2,
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
                    pointerEvents: "none"
                }}
            />
        }



        {/*<div*/}
        {/*    style={{*/}
        {/*        backgroundImage: iconImageObj*/}
        {/*            ? `url(${getSrcByImageObj(iconImageObj)})`*/}
        {/*            : undefined,*/}
        {/*    }}*/}
        {/*></div>*/}
      <Ripple color="var(--mm-color-text-bg-primary)" />
    </div>
  );
}
