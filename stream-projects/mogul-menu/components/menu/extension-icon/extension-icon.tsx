import {
    classKebab,
    getSrcByImageObj,
    React,
    Ripple, useState,
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

  const [width, setWidth] = useState(92);

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
            alignItems: menuOpen ? 'left': 'center',
            paddingLeft: menuOpen ? 0 : 4,
            width: menuOpen ? 48 : 92

        }}
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
