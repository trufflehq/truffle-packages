import { getPositionPrefix, getPositionSuffix, MenuPosition } from "../mod.ts";
import { Dimensions } from "../../../types/mod.ts";

/**
 * Returns true if the menu was dragged over the X axis
 */
export function isVerticalTranslation(lastPosition?: MenuPosition, newPosition?: MenuPosition) {
  const lastPositionPrefix = getPositionPrefix(lastPosition);
  const newPositionPrefix = getPositionPrefix(newPosition);
  const hasPositions = lastPosition && newPosition;
  return hasPositions && lastPositionPrefix !== newPositionPrefix;
}

/**
 * Returns true if the menu was dragged over the Y axis
 */
export function isHorizontalTranslation(lastPosition?: MenuPosition, newPosition?: MenuPosition) {
  const lastPositionSuffix = getPositionSuffix(lastPosition);
  const newPositionSuffix = getPositionSuffix(newPosition);

  const hasPositions = lastPosition && newPosition;
  return hasPositions && lastPositionSuffix !== newPositionSuffix;
}

/**
 * Gets the translation modifications for the translateFn in the draggable component
 */
export function getTranslationMods(
  lastPosition: MenuPosition,
  menuPosition: MenuPosition,
  dimensions: Dimensions,
) {
  let xMod = 0, yMod = 0;
  if (isVerticalTranslation(lastPosition, menuPosition)) {
    if (getPositionPrefix(lastPosition) === "bottom") {
      yMod = dimensions.base.y - dimensions.base.height;
    } else {
      yMod = 0 - dimensions.base.y + dimensions.base.height;
    }
  }
  if (isHorizontalTranslation(lastPosition, menuPosition)) {
    if (getPositionSuffix(lastPosition) === "left") {
      xMod = 0 - dimensions.base.x + dimensions.base.width;
    } else {
      xMod = dimensions.base.x - dimensions.base.width;
    }
  }

  return { xMod, yMod };
}
