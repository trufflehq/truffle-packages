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




      // console.log(hideMenu)

      // jumper.call("layout.listenForElements", {
      //     listenElementLayoutConfigSteps: [
      //         {
      //             action: "querySelector",
      //             value: "ytd-comments#comments ytd-item-section-renderer #contents",
      //         },
      //     ],
      //     observerConfig: { childList: true, subtree: true },
      //     targetQuerySelector: "ytd-comment-thread-renderer",
      //     shouldCleanupMutatedElements: true,
      // }, onEmit);

    // function onEmit(matches) {
    //     matches.forEach((match) => {
    //         const { id: elementId, data } = match;
    //         const authorId = data?.comment?.commentRenderer?.authorEndpoint
    //             ?.browseEndpoint?.browseId;
    //         console.log("Youtube comments!", { match, authorId });
    //
    //         jumper.call("layout.applyLayoutConfigSteps", {
    //             layoutConfigSteps: [
    //                 { action: "querySelector", value: `[data-truffle-id="${elementId}"]` },
    //                 {
    //                     action: "setStyle",
    //                     value: JSON.stringify({ border: `2px solid red` }),
    //                 },
    //             ],
    //             mutatedElementId: elementId,
    //         });
    //
    //         // NOTE: this won't return anything for 99.99% of commenters since we're using our staging data
    //         // you can manually add a connection for your org and sourceType: 'youtube', sourceId: your YouTube id
    //         // in the GraphQL API
    //         // const orgUserResponse = await query(GET_ORG_USER_QUERY, {
    //         //   input: {
    //         //     sourceType: "youtube",
    //         //     sourceId: authorId,
    //         //     orgId: getOrgId(),
    //         //   },
    //         // });
    //         // const orgUser = orgUserResponse.data.connection?.orgUser;
    //     });
    // }

  return (
      <div
          className={`c-extension-icon ${classKebab({ hasNotification })}`}
          style={{
              justifyContent: 'space-between',
              alignItems: menuOpen ? 'left': 'center',
              paddingLeft: menuOpen ? 0 : 4,
              width: menuOpen ? 48 : 92,
              border: "solid white",
              borderWidth: 2

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
