import { jumper, useEffect, useRef } from "../../../deps.ts";
import { getDimensions, getMenuPosition, MenuPosition, useMenu } from "../mod.ts";
import { DragInfo } from "../../draggable/draggable.tsx";
import { getTranslationMods } from "./translation.ts";
import { createMenuIframeStyle } from "./iframe-styles.ts";
import { getAbsoluteMenuPosition, getMenuSize, getWindowSize } from "./mod.ts";
import { getMenuPositionFromCoordinates, persistMenuPosition } from "./position.ts";
/**
 * This hook is used to translate the position of the child element inside
 * the draggable component based on the menu position. This allows us to reposition the child element
 * alongside the clip-path when the menu is dragged to a different quadrant with a different orientation.
 *
 * @param updateOnTranslate fn to update the dragInfo position state inside the Draggable component
 */
export function useTranslate(
  updateOnTranslate: (x: number, y: number, callback?: (dragInfo: DragInfo) => void) => void,
) {
  const lastPositionRef = useRef<MenuPosition>(undefined!);
  const { state: menuState, updateDimensions } = useMenu();
  const menuPosition = getMenuPosition(menuState);
  const dimensions = getDimensions(menuState);

  useEffect(() => {
    const lastPosition = lastPositionRef.current;
    if (menuPosition) {
      lastPositionRef.current = menuPosition;
      const { xMod, yMod } = getTranslationMods(lastPosition, menuPosition, dimensions);

      const updateStorage = (dragInfo: DragInfo) => {
        persistMenuPosition(menuPosition, {
          x: dragInfo.current.x + xMod,
          y: dragInfo.current.y + yMod,
        }, {
          x: dragInfo.start.x,
          y: dragInfo.start.y,
        });
      };

      updateOnTranslate(xMod, yMod, updateStorage);
      updateDimensions();
    }
  }, [menuPosition]);
}

/**
 * This hook is use to update the parent iframe with the updated coordinates/clip path
 * based on where the draggable component is dragged to.
 *
 * @param dragInfo draggable component state
 */
export function useUpdateDraggableMenuPosition(
  dragInfo: DragInfo,
) {
  const { state: menuState } = useMenu();
  const menuPosition = getMenuPosition(menuState);
  const dimensions = getDimensions(menuState);

  useEffect(() => {
    const style = createMenuIframeStyle(dimensions, dragInfo, menuPosition);
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        { action: "setStyle", value: style },
      ],
    });
  }, [dimensions, dragInfo, menuPosition]);
}

export function useWindowResizeObserver(
  dragInfo: DragInfo,
  shiftDragPosition: (x: number, y: number) => void,
) {
  const { state: menuState, setIsClosed, updateMenuPosition } = useMenu();
  const dimensions = getDimensions(menuState);
  const menuPosition = getMenuPosition(menuState);
  // create a resize observer that makes sure the draggable doesn't go off screen
  useEffect(() => {
    const resizeHandler = () => {
      setIsClosed();
      const { x, y } = getAbsoluteMenuPosition(dimensions, dragInfo.current);
      const windowSize = getWindowSize();
      const menuSize = getMenuSize(menuPosition, dimensions);

      const leftEdge = x;
      const rightEdge = x + menuSize.x;
      const topEdge = y;
      const bottomEdge = y + menuSize.y;

      // if the menu goes off the left side of the screen
      if (leftEdge < 0) {
        shiftDragPosition(-leftEdge, 0);
      }

      // if the menu goes off the right side of the screen
      if (rightEdge > windowSize.x) {
        shiftDragPosition(windowSize.x - rightEdge, 0);
      }

      // if the menu goes off the top of the screen
      if (topEdge < 0) {
        shiftDragPosition(0, -topEdge);
      }

      // if the menu goes off the bottom edge of the screen
      if (bottomEdge > windowSize.y) {
        shiftDragPosition(0, windowSize.y - bottomEdge);
      }

      // update the menu position if it changed
      const newMenuPosition = getMenuPositionFromCoordinates(x, y);
      updateMenuPosition(newMenuPosition);
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [dragInfo, dimensions]);
}
