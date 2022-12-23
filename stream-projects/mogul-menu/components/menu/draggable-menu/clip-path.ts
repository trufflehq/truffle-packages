import { getPositionPrefix, MenuPosition } from "../mod.ts";
import { Vector } from "../../draggable/draggable.tsx";
import { DimensionModifiers } from "../../draggable/draggable.tsx";
export type PositionModifiers = Pick<
  DimensionModifiers,
  "top" | "right" | "bottom" | "left"
>;

/**
 * Returns the clip path when the menu is in
 * the top half of the screen
 */
export function getTopClipPath(
  position: Vector,
  base: Vector,
  { top, right, bottom, left }: PositionModifiers,
) {
  return `inset(
      ${position.y + base.y + top}px
      calc(100% - ${position.x + base.x + right}px) 
      calc(100% - ${position.y + base.y + bottom}px) 
      ${position.x - left}px round 4px)`;
}

/**
 * Returns the clip path when the menu is in
 * the bottom half of the screen
 */
function getBottomClipPath(
  position: Vector,
  base: Vector,
  { top = 0, right = 0, bottom = 0, left = 0 }: Partial<PositionModifiers>,
) {
  return `inset(
    ${position.y + base.y + top}px
    calc(100% - ${position.x + base.x + right}px) 
    calc(100% - ${position.y - bottom}px)
    ${position.x - left}px round 4px)`;
}

/**
 * Returns the menu clip path based on the menu position
 */
export function createMenuClipPath(
  position: Vector,
  base: Vector,
  { top = 0, right = 0, bottom = 0, left = 0 }: Partial<PositionModifiers>,
  menuPosition: MenuPosition = "top-right",
) {
  const verticalPosition = getPositionPrefix(menuPosition);

  return verticalPosition === "top"
    ? getTopClipPath(position, base, { top, right, bottom, left })
    : getBottomClipPath(position, base, { top, right, bottom, left });
}
