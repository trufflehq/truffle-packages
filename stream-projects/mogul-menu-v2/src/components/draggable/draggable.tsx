import { React, useEffect, useState } from "../../deps.ts";

export interface Vector {
  x: number;
  y: number;
}

export interface DragInfo {
  current: Vector;
  start: Vector;
  pressed: boolean;
  draggable: boolean;
  over: boolean;
}

export interface DimensionModifiers {
  top: number;
  right: number;
  bottom: number;
  left: number;
  transition: string;
}

export interface DimensionsBase extends Vector {
  width: number;
  height: number;
}

export interface Dimensions {
  base: DimensionsBase;
  modifiers: Partial<DimensionModifiers>;
}

export interface TranslationMods {
  xMod: number;
  yMod: number;
}

/**
 * Updates the dragInfo when the mouse is pressed and being dragged
 *
 * @param updateDragInfo function to update the dragInfo state in the Draggable component
 * @param isPressed whether the mouse is pressed or not
 */
export function useUpdateDragPosition(
  updateDragInfo: (x: number, y: number) => void,
  isPressed: boolean,
) {
  useEffect(() => {
    const handleWindowMouseMove = (event: MouseEvent) => {
      updateDragInfo(event.clientX, event.clientY);
    };
    if (isPressed) {
      window.addEventListener("mousemove", handleWindowMouseMove);
    } else {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
  }, [isPressed]);
}

export default function Draggable({
  children,
  hidden,
  dimensions,
  defaultPosition,
  createClipPath,
  requiredClassName,
  initializePosition,
  onPressedMouseUp,
  onDragStart,
  onMouseEnter,
  onMouseLeave,
  translateFn,
  updateParentPosition,
  resizeObserver,
}: {
  children: React.ReactNode;
  createClipPath: (
    position: Vector,
    base: Vector,
    {
      top,
      right,
      bottom,
      left,
    }: Pick<Partial<DimensionModifiers>, "top" | "bottom" | "right" | "left">,
  ) => string;
  hidden?: boolean;
  dimensions: Dimensions;
  defaultPosition: Vector;
  requiredClassName: string;
  ignoreClassName?: string;
  onPressedMouseUp?: (e: React.MouseEvent, dragInfo: DragInfo) => void;
  onDragStart?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  translateFn?: (
    updateOnTranslate: (
      x: number,
      y: number,
      callback?: (dragInfo: DragInfo) => void,
    ) => void,
  ) => void;
  initializePosition?: (
    setInitialPosition: (current: Vector, start: Vector) => void,
  ) => void;
  updateParentPosition?: (dragInfo: DragInfo) => void;
  resizeObserver?: (
    dragInfo: DragInfo,
    shiftDragPosition: (x: number, y: number) => void,
  ) => void;
}) {
  const [dragInfo, setDragInfo] = useState<DragInfo>({
    current: defaultPosition,
    start: { x: 0, y: 0 },
    pressed: false,
    draggable: true,
  });

  useEffect(() => {
    initializePosition?.(setInitialPosition);
  }, []);

  const setInitialPosition = (current: Vector, start: Vector) => {
    setDragInfo((old: DragInfo) => ({
      ...old,
      current: {
        x: current.x,
        y: current.y,
      },
      start: {
        x: start.x,
        y: start.y,
      },
    }));
  };

  const updateDragPosition = (x: number, y: number) => {
    setDragInfo((old: DragInfo) => ({
      ...old,
      current: {
        x: x - old.start.x,
        y: y - old.start.y,
      },
    }));
  };

  const updateOnTranslate = (
    x: number,
    y: number,
    callback?: (dragInfo: DragInfo) => void,
  ) => {
    setDragInfo((old: DragInfo) => {
      callback?.(old);
      return {
        ...old,
        current: {
          x: old.current.x + x,
          y: old.current.y + y,
        },
      };
    });
  };

  useUpdateDragPosition(updateDragPosition, dragInfo.pressed);
  translateFn?.(updateOnTranslate);
  updateParentPosition?.(dragInfo);
  resizeObserver?.(dragInfo, updateOnTranslate);

  return (
    //outer div is the full screen div that is cropped with clip path
    <div
      className="draggable"
      hidden={hidden}
      draggable={true}
      style={{
        position: "absolute",
        top: "0px",
        left: "0px",
        background: "none",
        width: "100%",
        height: "100%",
        clipPath: createClipPath(
          dragInfo.current,
          dimensions.base,
          dimensions.modifiers,
        ),
        overflow: "hidden",
        cursor: dragInfo.pressed ? "grab" : "auto",
        // dragInfo.pressed disables the animation during drag
        transition: dragInfo.pressed ? "none" : dimensions.modifiers.transition,
      }}
      onMouseDown={(e) => {
        const target = e.target as HTMLDivElement;
        const classes = target.className;
        if (!classes?.includes || !classes?.includes(requiredClassName)) {
          setDragInfo((old: DragInfo) => ({ ...old, draggable: false }));
          return;
        }
      }}
      onDragStart={(e) => {
        e.preventDefault();
        if (dragInfo.draggable) {
          onDragStart?.(e);
          setDragInfo((old: DragInfo) => ({
            ...old,
            pressed: true,
            start: {
              x: e.clientX - old.current.x,
              y: e.clientY - old.current.y,
            },
          }));
        }
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dragInfo.pressed) {
          onPressedMouseUp?.(e, dragInfo);
        }

        setDragInfo((old: DragInfo) => ({
          ...old,
          pressed: false,
          draggable: true,
          start: {
            x: old.current.x,
            y: old.current.y,
          },
        }));
      }}
      onMouseEnter={(e) => {
        e.preventDefault();
        onMouseEnter?.(e);
      }}

      onMouseLeave={(e) => {
        e.preventDefault();
        onMouseLeave?.(e);
      }}
    >
      <div
        className="childr"
        style={{
          //set position of child container
          background: "none",
          width: "fit-content",
          position: "absolute",
          top: dragInfo.current.y + "px",
          left: dragInfo.current.x + "px",
          //disable text selection while dragging
          "user-select": dragInfo.pressed ? "none" : "inherit",
          "pointer-events": dragInfo.pressed ? "none" : "inherit",
        } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
