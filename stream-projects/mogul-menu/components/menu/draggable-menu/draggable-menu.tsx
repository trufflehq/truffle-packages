import { classKebab, jumper, React } from "../../../deps.ts";
import { getHasNotification, useTabs } from "../../tabs/mod.ts";
import {
  getDimensions,
  getIsOpen,
  getMenuPosition,
  getModifiersByPosition,
  INITIAL_MENU_STATE,
  MenuPosition,
  updateDimensions as updateDimensionsAction,
  useMenu,
} from "../mod.ts";
import {
  createMenuClipPath,
  getMenuMousePosition,
  getMenuPositionFromCoordinates,
  getTranslationMods,
  MOGUL_MENU_POSITION_KEY,
  persistMenuPosition,
  useTranslate,
  useUpdateDraggableMenuPosition,
  useWindowResizeObserver,
} from "./mod.ts";
import Draggable, { DimensionModifiers, DragInfo, Vector } from "../../draggable/draggable.tsx";

const DEFAULT_MENU_POSITION: MenuPosition = "top-right";
const DEFAULT_POSITION_ELEMENT_QUERY_SELECTOR = "#chatframe";
const DEFAULT_POSITION_OFFSET = { x: -100, y: 50 };

interface DefaultPositionInfo {
  current: Vector;
  start: Vector;
  menuPosition: MenuPosition;
}

export default function DraggableMenu({
  children,
  defaultPositionElementQuerySelector = DEFAULT_POSITION_ELEMENT_QUERY_SELECTOR,
  defaultPositionOffset = DEFAULT_POSITION_OFFSET,
}: {
  children: React.ReactNode;
  defaultPositionElementQuerySelector?: string;
  defaultPositionOffset?: Vector;
}) {
  const { state: tabsState } = useTabs();
  const {
    state: menuState,
    dispatch,
    updateMenuPosition,
    updateDimensions,
    setIsClosed,
  } = useMenu();
  const hasNotification = getHasNotification(tabsState);
  const isOpen = getIsOpen(menuState);
  const menuPosition = getMenuPosition(menuState);
  const className = `c-browser-extension-menu position-${menuPosition} ${
    classKebab(
      { isOpen, hasNotification },
    )
  }`;

  const initializePosition = async (
    setInitialPosition: (current: Vector, start: Vector) => void,
  ) => {
    const positionFromStorage = await jumper?.call("storage.get", {
      key: MOGUL_MENU_POSITION_KEY,
    });
    let positionInfo: DefaultPositionInfo;

    // load the previously saved position
    if (positionFromStorage) {
      positionInfo = JSON.parse(positionFromStorage);

      // if this is the first time loading the icon
      // give it the default position
    } else {
      const defaultPosition = (await jumper?.call("layout.getElementBoundingClientRect", {
        querySelector: defaultPositionElementQuerySelector,
      })) || {};

      const dimensions = INITIAL_MENU_STATE.dimensions;
      if (!defaultPosition?.x && !defaultPosition?.y) {
        defaultPosition.x = defaultPosition?.x || 0;
        defaultPosition.y = defaultPosition?.y || 0;
        defaultPositionOffset.x = 0;
        defaultPositionOffset.y = 0;
      }

      const menuPosition = getMenuPositionFromCoordinates(
        defaultPosition?.x,
        defaultPosition?.y,
      );

      // simulate moving it from the top-left (the default)
      // to where ever it's going to get positioned
      const translationMods = getTranslationMods(
        DEFAULT_MENU_POSITION,
        menuPosition,
        dimensions,
      );

      const defaultPositionVector = {
        x: defaultPosition.x + translationMods.xMod + defaultPositionOffset.x,
        y: defaultPosition.y + translationMods.yMod + defaultPositionOffset.y,
      };

      positionInfo = {
        current: defaultPositionVector,
        start: defaultPositionVector,
        menuPosition,
      };
    }

    const { current, start, menuPosition } = positionInfo ?? {};

    updateMenuPosition(menuPosition);
    dispatch(updateDimensionsAction(getModifiersByPosition(menuPosition)));

    // lazily reenable the transition after the mount so it's not janky
    setTimeout(() => {
      updateDimensions({
        transition: ".25s cubic-bezier(.4, .71, .18, .99)",
      });
    }, 250);

    if (current && start) {
      setInitialPosition(current, start);
      persistMenuPosition(
        menuPosition ?? DEFAULT_MENU_POSITION,
        current,
        start,
      );
    }
  };

  const onPressedMouseUp = (e: React.MouseEvent, dragInfo: DragInfo) => {
    updateMenuPosition(getMenuMousePosition(e));
    updateDimensions();

    const menuPosition = getMenuMousePosition(e);

    persistMenuPosition(
      menuPosition,
      {
        x: dragInfo.current.x,
        y: dragInfo.current.y,
      },
      {
        x: dragInfo.start.x,
        y: dragInfo.start.y,
      },
    );

    // re-enable the transition
    setTimeout(() => {
      updateDimensions({
        transition: ".25s cubic-bezier(.4, .71, .18, .99)",
      });
    }, 100);
  };

  const onDragStart = () => {
    setIsClosed();
    updateDimensions({
      transition: "none",
    });
  };

  const createClipPath = (
    position: Vector,
    base: Vector,
    {
      top,
      right,
      bottom,
      left,
    }: Pick<Partial<DimensionModifiers>, "top" | "bottom" | "right" | "left">,
  ) => {
    return createMenuClipPath(
      position,
      base,
      { top, right, bottom, left },
      menuPosition,
    );
  };

  const dimensions = getDimensions(menuState);
  const defaultPosition = { x: 0, y: 0 };

  return (
    <Draggable
      requiredClassName="c-extension-icon"
      dimensions={dimensions}
      defaultPosition={defaultPosition}
      onPressedMouseUp={onPressedMouseUp}
      onDragStart={onDragStart}
      translateFn={useTranslate}
      updateParentPosition={useUpdateDraggableMenuPosition}
      createClipPath={createClipPath}
      resizeObserver={useWindowResizeObserver}
      initializePosition={initializePosition}
    >
      <div className={className}>
        <div className="menu">{children}</div>
      </div>
    </Draggable>
  );
}
