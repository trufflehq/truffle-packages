import { React, useEffect, useSelector, useStyleSheet } from "../../../deps.ts";
import { dialogStack$ } from "./dialog-service.ts";
import styleSheet from "./dialog-container.scss.js";

export default function DialogContainer() {
  useStyleSheet(styleSheet);

  const topDialog = useSelector(() =>
    dialogStack$.get().length ? dialogStack$.get()[dialogStack$.get().length - 1] : null
  );

  const handleEscape = (ev: KeyboardEvent) => {
    if (ev.key === "Escape") {
      dialogStack$.set((currentStack) => currentStack.slice(0, -1));
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape, false);

    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, []);

  if (topDialog === null) return <></>;

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!topDialog?.isModal && e.target === e.currentTarget) {
      dialogStack$.set((currentStack) => currentStack.slice(0, -1));
    }
  };

  return (
    <div className="c-dialog-container" onClick={handleBgClick}>
      {topDialog.element}
    </div>
  );
}
