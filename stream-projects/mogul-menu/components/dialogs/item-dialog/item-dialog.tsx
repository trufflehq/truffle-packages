// TODO: delete this component entirely

import React from "https://npm.tfl.dev/react";
import { getSrcByImageObj } from "../../../deps.ts";

import Button from "../../base/button/button.tsx";
import ImageByAspectRatio from "https://tfl.dev/@truffle/ui@~0.2.0/components/legacy/image-by-aspect-ratio/image-by-aspect-ratio.tsx";
import Dialog from "../../base/dialog/dialog.tsx";
import StyleSheet from "../../base/stylesheet/stylesheet.tsx";

/**
 * @callback onExit
 */

/**
 * @typedef {Object} DialogButton
 * @property {string} text
 * @property {string} textColor
 * @property {string} bg
 * @property {Function} onClick
 */

/**
 * @param {Object} props
 * @param {Object} props.imgRel A fileRel object for an image to display for the item
 * @param {onExit} props.onExit Called if the user selects the X button or clicks out of the dialog
 * @param {'center'|'left'} props.displayMode Whether the dialog should display the content and the image centered or left aligned. valueText is not shown in center mode.
 * @param {JSX} props.headerText The header text of the dialog, appears above the child image/components.
 * @param {JSX} props.$title The dialog title.
 * @param {JSX} props.highlightBg Sets a css var for a highlight background.
 * @param {JSX} props.primaryText The call to action text underneath the child image/components.
 * @param {JSX} props.valueText If the dialog is in left display mode, the valueText will appear between the primary and secondary text.
 * @param {JSX} props.secondaryText Smaller, more faded text under the primary text. Suitable for a description.
 * @param {Array<DialogButton>} props.buttons
 * @returns {Object}
 */
export default function ItemDialog({
  displayMode = "center",
  imgRel,
  $children,
  $controls,
  onExit,
  $title,
  highlightBg,
  headerText,
  primaryText,
  valueText,
  secondaryText,
  secondaryTextStyle,
  buttons,
}) {
  if (!onExit) {
    console.warn("[browser-extension-item-dialog] onExit not defined");
  }
  if (!imgRel) {
    console.warn("[browser-extension-item-dialog] fileRel not defined");
  }

  // const { error } = useSelector(() => error$.get());

  const onExitHandler = () => {
    onExit?.();
  };

  const actions = buttons?.map((button, idx) => {
    if (!button.onClick) {
      console.warn(
        `[browser-extension-item-dialog] button ${idx} does not have a click handler defined`,
      );
    }

    return (
      <Button
        key={idx}
        shouldHandleLoading={true}
        onClick={() => {
          return button.onClick?.();
        }}
      >
        {button.text}
      </Button>
    );
  });

  if (displayMode === "left") {
    return (
      <StyleSheet url={new URL("item-dialog.css", import.meta.url)}>
        <div className="c-browser-extension-item-dialog left use-css-vars-creator">
          <style>
            {`
          .z-browser-extension-item-dialog {
            --highlight-gradient: ${highlightBg ?? ""};
          }
        `}
          </style>

          <Dialog actions={actions}>
            <div className="body">
              <div className="image">
                <ImageByAspectRatio
                  imageUrl={getSrcByImageObj(imgRel?.fileObj)}
                  aspectRatio={imgRel?.fileObj?.data?.aspectRatio}
                  heightPx={56}
                  widthPx={56}
                />
              </div>
              <div className="info">
                <div className="primary-text">{primaryText}</div>
                <div className="value-text">{valueText}</div>
                <div className="secondary-text">{secondaryText}</div>
              </div>
              {error && <div className="error">{error}</div>}
            </div>
          </Dialog>
        </div>
      </StyleSheet>
    );
  }

  return (
    <StyleSheet url={new URL("item-dialog.css", import.meta.url)}>
      <div className="c-browser-extension-item-dialog center use-css-vars-creator">
        <style>
          {`
        .z-browser-extension-item-dialog {
          --highlight-gradient: ${highlightBg ?? "var(--tfl-color-primary-fill)"};
        }
      `}
        </style>
        <Dialog actions={actions}>
          <div className="body">
            {headerText && <div className="header-text">{headerText}</div>}
            <div className="children">
              {$children || (
                <ImageByAspectRatio
                  imageUrl={getSrcByImageObj(imgRel?.fileObj)}
                  aspectRatio={imgRel?.fileObj?.data?.aspectRatio}
                  heightPx={72}
                  widthPx={72}
                />
              )}
            </div>
            <div className="primary-text">{primaryText}</div>
            <div className={`secondary-text ${secondaryTextStyle}`}>
              {secondaryText}
            </div>
            {error && <div className="error">{error}</div>}
            {$controls && <div className="controls">{$controls}</div>}
          </div>
        </Dialog>
      </div>
    </StyleSheet>
  );
}
