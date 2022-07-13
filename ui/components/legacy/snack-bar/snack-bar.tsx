import React from "https://npm.tfl.dev/react";

import ScopedStylesheet from "../scoped-stylesheet/scoped-stylesheet.tsx";

const DEFAULT_VISIBILITY_DURATION_MS = 4000;
const DEFAULT_FADE_DURATION = 500;

export default function SnackBar({
  message,
  value,
  messageTextColor,
  messageBgColor,
  valueTextColor,
  valueBgColor,
  style = "default", // default | flat
  className,
  visibilityDuration = DEFAULT_VISIBILITY_DURATION_MS,
  fadeDuration = DEFAULT_FADE_DURATION,
}) {
  const fadeOutDelay = visibilityDuration + fadeDuration;
  // TODO: figure out why jscodeshift throws for Converting circular structure to JSON
  // if this is an inline prop w/o cssUrl var. I think it's probably from the getNode stuff
  const cssUrl = new URL("./snack-bar.css", import.meta.url);
  return (
    <ScopedStylesheet url={cssUrl}>
      <div
        className={`c-snack-bar-el ${style} ${className}`}
        style={{
          animation:
            `slideIn linear ${fadeDuration}ms, stayVisible linear ${visibilityDuration}ms ${fadeDuration}ms, slideOut linear ${fadeDuration}ms ${fadeOutDelay}ms`,
        }}
      >
        <div
          className="message"
          style={{
            background: messageBgColor,
            color: messageTextColor,
          }}
        >
          {message}
        </div>
        <div
          className="value"
          style={{
            background: valueBgColor,
            color: valueTextColor,
          }}
        >
          {value}
        </div>
      </div>
    </ScopedStylesheet>
  );
}
