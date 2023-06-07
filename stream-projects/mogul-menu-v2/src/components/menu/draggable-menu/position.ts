import { jumper, React } from "../../../deps.ts";

import { getPositionPrefix, MenuPosition } from "../mod.ts";
import { MOGUL_MENU_POSITION_KEY } from "./constants.ts";
import { Dimensions, Vector } from "../../draggable/draggable.tsx";

/**
 * Returns (x,y) for the window
 */
export function getWindowSize() {
  const win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName("body")[0],
    x = win.innerWidth || docElem.clientWidth || body.clientWidth,
    y = win.innerHeight || docElem.clientHeight || body.clientHeight;

  return { x, y };
}

/**
 * Gets the MenuPosition based on where the mouse coordinates are. To be used
 * in conjunction with the Draggable component
 */
export function getMenuMousePosition(event: MouseEvent | React.MouseEvent) {
  return getMenuPositionFromCoordinates(event.clientX, event.clientY);
}

/**
 * Gets the MenuPosition based on a pair of x-y coordinates.
 *
 * @param xPos
 * @param yPos
 * @returns
 */
export function getMenuPositionFromCoordinates(xPos: number, yPos: number) {
  let vertical = "top";
  let horizontal = "right";
  const { x, y } = getWindowSize();

  if (yPos < Math.floor(y / 2)) {
    vertical = "top";
  } else {
    vertical = "bottom";
  }

  if (xPos < Math.floor(x / 2)) {
    horizontal = "left";
  } else {
    horizontal = "right";
  }

  return `${vertical}-${horizontal}` as MenuPosition;
}

/**
 * Gets the position of the upper left hand corner of the menu regardless of the current orientation of the menu.
 *
 * @param dimensions
 * @param location
 */
export function getAbsoluteMenuPosition(
  dimensions: Dimensions,
  location: Vector,
): Vector {
  return {
    x: location.x - dimensions.modifiers.left,
    y: location.y + dimensions.base.y + dimensions.modifiers.top,
  };
}

/**
 * Gets the current size of the menu.
 *
 * @param dimensions
 * @returns
 */
export function getMenuSize(
  menuPosition: MenuPosition | undefined,
  dimensions: Dimensions,
) {
  const verticalPosition = getPositionPrefix(menuPosition);

  return {
    x: dimensions.base.x + dimensions.modifiers.right +
      dimensions.modifiers.left,
    y: verticalPosition === "top"
      ? Math.abs(dimensions.modifiers.bottom - dimensions.modifiers.top)
      : dimensions.base.y + dimensions.modifiers.bottom -
        dimensions.modifiers.top,
  };
}

export function persistMenuPosition(
  menuPosition: MenuPosition,
  current: { x: number; y: number },
  start: { x: number; y: number },
) {
  jumper.call("storage.set", {
    key: MOGUL_MENU_POSITION_KEY,
    value: JSON.stringify({
      menuPosition,
      current,
      start,
    }),
  });
}
