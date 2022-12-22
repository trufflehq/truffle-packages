import {
  classKebab,
  getSrcByImageObj,
  Icon,
  ImageByAspectRatio,
  jumper,
  React,
  useEffect,
  useSelector,
  useStyleSheet,
} from "../../../deps.ts";
import styleSheet from "./native-menu.scss.js";

import Tabs from "../../tabs/tabs.tsx";
import TabBar from "../../tab-bar/tab-bar.tsx";
import PageStack from "../../page-stack/page-stack.tsx";
import { SnackBarContainer } from "../../snackbar/mod.ts";
import { useOrientationHandler } from "../../orientation/mod.ts";
import "https://npm.tfl.dev/swiped-events@1.1.6/dist/swiped-events.min.js";

import { ActionBannerContainer } from "../../action-banner/mod.ts";
import DialogContainer from "../../base/dialog-container/dialog-container.tsx";
import { MogulMenuProps } from "../menu.tsx";
import {
  BASE_MENU_STYLES,
  changeFrameOrientation,
  getOrientationByWindow,
  isCollapsed$,
  orientation$,
} from "../../orientation/mod.ts";
import { File } from "../../../types/mod.ts";
import { getMenuPosition, useMenu } from "../mod.ts";

const DEFAULT_SWIPE_THRESHOLD = "250";

/**
 * Returns an object with the CSS styles that will be applied as inline styles to the
 * parent iframe of the extension mapping (or embeddable or whatever).
 */
export function createMenuIframeStyle() {
  return BASE_MENU_STYLES;
}

function useUpdateNativeMenuPosition() {
  const { state: menuState } = useMenu();
  const menuPosition = getMenuPosition(menuState);

  useEffect(() => {
    const style = createMenuIframeStyle();
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        { action: "setStyle", value: style },
      ],
    });
  }, [menuPosition]);
}

export function useSwipeHandler() {
  useEffect(() => {
    document.body.dataset.swipeThreshold = DEFAULT_SWIPE_THRESHOLD;
    document.addEventListener("swiped-down", function (e) {
      e.stopPropagation();
      e.preventDefault();
      const orientation = getOrientationByWindow();
      if (orientation === "portrait") {
        isCollapsed$.set(true);
        changeFrameOrientation({
          orientation: getOrientationByWindow(),
          isCollapsed: true,
        });
      }
    });

    return () => document.removeEventListener("swiped-down", () => {}, true);
  }, []);
}

export default function NativeMenu(props: MogulMenuProps) {
  useStyleSheet(styleSheet);
  useUpdateNativeMenuPosition();
  useOrientationHandler();
  useSwipeHandler();
  const orientation = useSelector(() => orientation$.get());

  const onOpen = () => {
    isCollapsed$.set(false);

    changeFrameOrientation({
      orientation: getOrientationByWindow(),
      isCollapsed: false,
    });
  };

  const isCollapsed = useSelector(() => isCollapsed$.get());

  return (
    <div className={`c-native-menu ${classKebab({ isCollapsed, isOpen: !isCollapsed })}`}>
      <div className={`menu ${orientation}`}>
        {isCollapsed
          ? orientation === "landscape"
            ? <LandscapeCollapsedButton onOpen={onOpen} />
            : <PortraitCollapsedButton onOpen={onOpen} iconImageObj={props.iconImageObj} />
          : null}
        <ExpandedMenu {...props} />
      </div>
    </div>
  );
}

function LandscapeCollapsedButton({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="landscape-collapsed-button" onClick={onOpen}>
      <Icon
        icon="chevron-left"
        size="32px"
      />
    </div>
  );
}

function PortraitCollapsedButton(
  { onOpen, iconImageObj }: { onOpen: () => void; iconImageObj?: File },
) {
  return (
    <div className="portrait-collapsed-button" onClick={onOpen}>
      <div className="extension-icon">
        <ImageByAspectRatio
          imageUrl={getSrcByImageObj(iconImageObj)}
          aspectRatio={iconImageObj?.data?.aspectRatio}
          height={28}
          width={28}
        />
      </div>
      <span className="title">Extension</span>
    </div>
  );
}

function ExpandedMenu(props: MogulMenuProps) {
  const onCollapse = () => {
    isCollapsed$.set(true);
    changeFrameOrientation({
      orientation: getOrientationByWindow(),
      isCollapsed: true,
    });
  };
  const orientation = useSelector(() => orientation$.get());
  const isCollapsed = useSelector(() => isCollapsed$.get());

  return (
    <div className={`inner ${classKebab({ isCollapsed })}`}>
      {orientation === "landscape" && (
        <div className="collapse">
          <div className="icon">
            <Icon
              icon="close"
              size="20px"
              onclick={onCollapse}
            />
          </div>
        </div>
      )}
      <div className="bottom">
        <TabBar />
      </div>
      <div className="body">
        <DialogContainer />
        <PageStack />
        <ActionBannerContainer />
        <SnackBarContainer />
        <Tabs tabs={props.tabs} />
      </div>
    </div>
  );
}
