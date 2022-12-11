import { _, jumper, signal, useEffect } from "../../deps.ts";
import { changeFrameOrientation } from "./jumper.ts";

type Orientation = "landscape" | "portrait";

export const isCollapsed$ = signal(false);

export const orientation$ = signal<Orientation>(getOrientationByWindow()!);

export function getOrientation(orientationType: OrientationType) {
  switch (orientationType) {
    case "portrait-primary":
    case "portrait-secondary":
      return "portrait";
    case "landscape-primary":
    case "landscape-secondary":
      return "landscape";
  }
}

export function getOrientationByWindow() {
  const angle = window?.orientation;
  switch (angle) {
    case 0:
    case 180:
      return "portrait";
    case 90:
    case -90:
      return "landscape";
  }
}

// FIXME: add support for sourceType so we can support youtube & twitch specific styles
export function useOrientationHandler() {
  const handleOrientationChange = (event: Event) => {
    jumper.call(
      "platform.log",
      `window orientationchange ${window?.orientation} ${
        JSON.stringify(event.target?.screen?.orientation)
      }`,
    );

    let orientation: Orientation | undefined;

    // works on every device/browser except safari
    if (event.target?.screen?.orientation) {
      orientation = getOrientation(event?.target?.screen?.orientation?.type);

      // works on safari
    } else if (window?.orientation !== undefined) {
      orientation = getOrientationByWindow();
    }

    if (orientation) {
      orientation$.set(orientation);
      changeFrameOrientation({ orientation, isCollapsed: isCollapsed$.get() });
    }
  };

  useEffect(() => {
    // get the frame orientation on mount
    changeFrameOrientation({
      orientation: getOrientationByWindow(),
      isCollapsed: isCollapsed$.get(),
    });

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => window?.removeEventListener("orientationchange", handleOrientationChange, true);
  }, []);
}
