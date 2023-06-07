import { React, useEffect, useMemo, useStyleSheet } from "../../deps.ts";
import {
  getMenuPosition,
  getPositionPrefix,
  getSnackBars,
  getTopSnackbar,
  useMenu,
} from "../menu/mod.ts";
import styleSheet from "./snack-bar-container.scss.js";

const DEFAULT_VISIBILITY_DURATION_MS = 5000;

export default function SnackBarContainer({
  children,
  visibilityDuration = DEFAULT_VISIBILITY_DURATION_MS,
}: {
  children?: React.ReactNode;
  visibilityDuration?: number;
}) {
  useStyleSheet(styleSheet);
  const { state: menuState, popSnackBar } = useMenu();
  const menuPosition = getMenuPosition(menuState);
  const prefix = getPositionPrefix(menuPosition);
  const $currentSnackBar = getTopSnackbar(menuState);
  const snackBarQueue = useMemo(() => getSnackBars(menuState), [
    JSON.stringify(menuState.snackBars),
  ]);

  const shouldRenderSnackBar = snackBarQueue.length > 0;

  useEffect(() => {
    let cancel = false;

    if (snackBarQueue.length > 0) {
      setTimeout(() => {
        // If the queue has changed by the time we reach this,
        // we want to cancel removing anything from the queue
        // and let the new version of the effect do it instead.
        if (cancel) return;

        // remove item from the front of the queue
        // and schedule the next item to be removed
        popSnackBar();
      }, visibilityDuration);
    }

    return () => {
      cancel = true;
    };
  }, [snackBarQueue]);

  return (
    <>
      <div className={`c-snack-bar-container position-${prefix}`}>
        {shouldRenderSnackBar && $currentSnackBar}
      </div>
      {children}
    </>
  );
}
