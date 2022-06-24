import React, { useMemo } from "https://npm.tfl.dev/react";

import { createSubject } from "https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js";
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";
import classKebab from "https://tfl.dev/@truffle/utils@0.0.1/legacy/class-kebab.js";

import Icon from "../icon/icon.jsx";
import ImageByAspectRatio from "../image-by-aspect-ratio/image-by-aspect-ratio.jsx";
import Ripple from "../ripple/ripple.jsx";
import ScopedStylesheet from "../scoped-stylesheet/scoped-stylesheet.jsx";

/**
 * @param {Object} props
 * @param {primary|secondary|gradient} [props.style=primary] general style classification (color, border, etc...)
 * @param {small|medium|large} [props.size=medium]
 * @param {button|submit} [props.type=button] native <button> type
 * @param {string} [props.background] override the background
 * @param {string} [props.backgroundHover] override the background on hover
 * @param {string} [props.backgroundSelected] override the background when isSelected is true
 * @param {string} [props.borderRadius] override the border radius
 * @param {string} [props.borderRadiusHover] override the border radius on hover
 * @param {string} [props.borderRadiusSelected] override the border radius when isSelected is true
 * @param {string} [props.outline] override the outline
 * @param {string} [props.outlineHover] override the outline on hover
 * @param {string} [props.outlineSelected] override the outline when isSelected is true
 * @param {string} [props.transformHover] set the css transform property on hover
 * @param {string} [props.transformSelected] set the css transform property when isSelected is true
 * @param {string} [props.hoverTransition] set the css transition property on hover
 * @param {string} [props.selectedTransition] set the css transition property when isSelected is true
 * @param {string} [props.text] the text inside the button
 * @param {string} [props.textColor] the color of the text
 * @param {string} [props.icon] can either be a url to an image or a string to be passed to the <Icon /> component (the button component will figure out which one it is)
 * @param {left|right} [props.iconLocation=left] position of the icon
 * @param {number} [props.iconViewBox] passed directly to the viewBox prop of the icon component
 * @param {string} [props.iconColor] passed directly to the color prop of the icon component
 * @param {boolean} [props.iconCircled] passed directly to the isCircled prop of the icon component
 * @param {number} [props.iconSize] size of the icon in pixels
 * @param {boolean} [props.shouldHandleLoading] if true, awaits onclick promise and shows loading during
 * @param {string} [props.href] if specified, the button is an <a>
 * @param {string} [props.target] specifies the link target
 * @param {function} [props.onClick]
 * @param {function} [props.onMouseDown]
 * @param {boolean} [props.isDisabled]
 * @param {boolean} [props.isFullWidth] if true, is width: 100%
 * @param {boolean} [props.isSelected] eg if action button is causing is true (drawer opened)
 * @param {subject} [props.isLoadingSubject]
 */

export default function Button(props) {
  const {
    style = "primary",
    size = "medium",
    type = "button",
    background,
    backgroundHover,
    backgroundSelected,
    outline,
    outlineHover,
    outlineSelected,
    transformHover,
    transformSelected,
    borderRadius,
    borderRadiusHover,
    borderRadiusSelected,
    hoverTransition,
    selectedTransition,
    text,
    textColor,
    icon,
    iconViewBox,
    iconColor,
    iconCircled,
    iconSize = 20,
    iconLocation = "left",
    shouldHandleLoading,
    href,
    onClick,
    onMouseDown,
    isDisabled,
    isSelected,
    isFullWidth,
    target,
  } = props;
  const { isLoadingSubject } = useMemo(() => {
    return {
      isLoadingSubject: props.isLoadingSubject || createSubject(false),
    };
  }, []);

  const { isLoading } = useObservables(() => ({
    isLoading: isLoadingSubject.obs,
  }));

  const styleInfoMap = {
    primary: {
      "--background": "var(--truffle-color-primary)",
      "--background-hover": "var(--truffle-color-primary)",
      "--background-selected": "var(--truffle-color-primary)",
      "--text-color": "var(--truffle-color-text-primary)",
      "--border-radius": "4px",
      "--border-radius-hover": "4px",
      "--border-radius-selected": "4px",
      "--outline": "none",
      "--outline-hover": "none",
      "--outline-selected": "none",
      "--transform-hover": "none",
      "--transform-selected": "none",
      "--hover-transition": "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
      "--selected-transition": "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    secondary: {
      "--background": "var(--truffle-color-tertiary)",
      "--background-hover": "var(--truffle-color-tertiary)",
      "--background-selected": "var(--truffle-color-tertiary)",
      "--text-color": "var(--truffle-color-text-tertiary)",
      "--border-radius": "4px",
      "--border-radius-hover": "4px",
      "--border-radius-selected": "4px",
      "--outline": "none",
      "--outline-hover": "none",
      "--outline-selected": "none",
      "--transform-hover": "none",
      "--transform-selected": "none",
      "--hover-transition": "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
      "--selected-transition": "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    gradient: {
      "--background": "var(--truffle-gradient)",
      "--background-hover": "var(--truffle-gradient)",
      "--background-selected": "var(--truffle-gradient)",
      "--text-color": "var(--truffle-color-text-gradient)",
      "--border-radius": "4px",
      "--border-radius-hover": "4px",
      "--border-radius-selected": "4px",
      "--outline": "none",
      "--outline-hover": "none",
      "--outline-selected": "none",
      "--transform-hover": "none",
      "--transform-selected": "none",
      "--hover-transition": "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
      "--selected-transition": "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
    },
  };

  const buttonStyles = styleInfoMap[style];

  // allow the dev to override default styles
  if (textColor) buttonStyles["--text-color"] = textColor;
  if (background) buttonStyles["--background"] = background;
  if (backgroundHover) buttonStyles["--background-hover"] = backgroundHover;
  if (backgroundSelected) {
    buttonStyles["--background-selected"] = backgroundSelected;
  }
  if (outline) buttonStyles["--outline"] = outline;
  if (outlineHover) buttonStyles["--outline-hover"] = outlineHover;
  if (outlineSelected) buttonStyles["--outline-selected"] = outlineSelected;
  if (borderRadius) buttonStyles["--border-radius"] = borderRadius;
  if (borderRadiusHover) {
    buttonStyles["--border-radius-hover"] = borderRadiusHover;
  }
  if (borderRadiusSelected) {
    buttonStyles["--border-radius-selected"] = borderRadiusSelected;
  }
  if (transformHover) buttonStyles["--transform-hover"] = transformHover;
  if (transformSelected) {
    buttonStyles["--transform-selected"] = transformSelected;
  }
  if (hoverTransition) buttonStyles["--hover-transition"] = hoverTransition;
  if (selectedTransition) {
    buttonStyles["--selected-transition"] = selectedTransition;
  }

  const isIconRemote = /^https?:\/\//.test(icon);
  const $iconWrapper = icon && (
    <div className="icon-wrapper">
      {isIconRemote
        ? (
          <ImageByAspectRatio
            imageUrl={icon}
            aspectRatio={1}
            width={iconSize}
            height={iconSize}
          />
        )
        : (
          <Icon
            icon={icon}
            size={iconSize}
            color={iconColor || buttonStyles["--text-color"]}
            viewBox={iconViewBox}
            isCircled={iconCircled}
          />
        )}
    </div>
  );

  // TODO: routing w/o hard page load if href exists

  // TODO: figure out why jscodeshift throws for Converting circular structure to JSON
  // if this is an inline prop w/o cssUrl var. I think it's probably from the getNode stuff
  const cssUrl = new URL("./button.css", import.meta.url);
  return (
    <ScopedStylesheet url={cssUrl}>
      <button
        className={`c-button style-${style} size-${size} icon-location-${iconLocation} ` +
          classKebab({
            hasIcon: Boolean(icon),
            isSelected,
            isFullWidth,
          })}
        type={type}
        disabled={Boolean(isDisabled)}
        href={href}
        target={target}
        style={buttonStyles}
        onMouseDown={onMouseDown}
        onClick={async (e) => {
          if (!isDisabled) {
            shouldHandleLoading && isLoadingSubject.next(true);
            try {
              await onClick?.(e);
              shouldHandleLoading && isLoadingSubject.next(false);
            } catch (err) {
              shouldHandleLoading && isLoadingSubject.next(false);
              throw err;
            }
          }
        }}
      >
        {icon && iconLocation === "left" && $iconWrapper}
        {isLoading ? "Loading..." : text}
        {icon && iconLocation === "right" && $iconWrapper}
        {/* <Ripple color={textColor} /> */}
      </button>
    </ScopedStylesheet>
  );
}
