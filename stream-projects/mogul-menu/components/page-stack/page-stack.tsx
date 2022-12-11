import { React, useEffect, useSelector, useStyleSheet } from "../../deps.ts";
import styleSheet from "./page-stack.scss.js";
import { usePageStack } from "./hooks.ts";

export default function PageStack({
  background = "var(--mm-color-bg-primary)",
}: {
  background?: string;
}) {
  const { pageStack$, popPage, getTopPage } = usePageStack();
  useStyleSheet(styleSheet);

  const isPageStackEmpty = useSelector(() => !pageStack$.get() || pageStack$.get()!.length === 0);

  const handleEscape = (ev: KeyboardEvent) => {
    const top = getTopPage();
    const isEscapeDisabled = top && top.isEscapeDisabled;
    if (ev.key === "Escape" && !isEscapeDisabled) {
      popPage();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape, false);

    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, [pageStack$.get()]);

  const pageStack = useSelector(() => pageStack$.get() || []);
  return (
    <>
      {isPageStackEmpty
        ? <></>
        : (
          <div className="c-page-stack" style={{ "--background": background }}>
            {pageStack.map(({ Component }, idx) => (
              <div key={idx} className="page">
                {Component}
              </div>
            ))}
          </div>
        )}
    </>
  );
}
