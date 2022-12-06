import React, { useMemo } from "https://npm.tfl.dev/react";
import { createSubject } from "https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js";
import useObservables from "https://tfl.dev/@truffle/utils@~0.0.3/obs/use-observables-react.ts";
import classKebab from "https://tfl.dev/@truffle/utils@0.0.1/legacy/class-kebab.js";
import Icon from "../icon/icon.tsx";
import ImageByAspectRatio from "../image-by-aspect-ratio/image-by-aspect-ratio.tsx";
import ScopedStylesheet from "../scoped-stylesheet/scoped-stylesheet.tsx";
function Button(props) {
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
  if (textColor) {
    buttonStyles["--text-color"] = textColor;
  }
  if (background) {
    buttonStyles["--background"] = background;
  }
  if (backgroundHover) {
    buttonStyles["--background-hover"] = backgroundHover;
  }
  if (backgroundSelected) {
    buttonStyles["--background-selected"] = backgroundSelected;
  }
  if (outline) {
    buttonStyles["--outline"] = outline;
  }
  if (outlineHover) {
    buttonStyles["--outline-hover"] = outlineHover;
  }
  if (outlineSelected) {
    buttonStyles["--outline-selected"] = outlineSelected;
  }
  if (borderRadius) {
    buttonStyles["--border-radius"] = borderRadius;
  }
  if (borderRadiusHover) {
    buttonStyles["--border-radius-hover"] = borderRadiusHover;
  }
  if (borderRadiusSelected) {
    buttonStyles["--border-radius-selected"] = borderRadiusSelected;
  }
  if (transformHover) {
    buttonStyles["--transform-hover"] = transformHover;
  }
  if (transformSelected) {
    buttonStyles["--transform-selected"] = transformSelected;
  }
  if (hoverTransition) {
    buttonStyles["--hover-transition"] = hoverTransition;
  }
  if (selectedTransition) {
    buttonStyles["--selected-transition"] = selectedTransition;
  }
  const isIconRemote = /^https?:\/\//.test(icon);
  const $iconWrapper = icon && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "icon-wrapper",
    },
    isIconRemote
      ? /* @__PURE__ */ React.createElement(ImageByAspectRatio, {
        imageUrl: icon,
        aspectRatio: 1,
        width: iconSize,
        height: iconSize,
      })
      : /* @__PURE__ */ React.createElement(Icon, {
        icon,
        size: iconSize,
        color: iconColor || buttonStyles["--text-color"],
        viewBox: iconViewBox,
        isCircled: iconCircled,
      }),
  );
  const cssUrl = new URL("./button.css", import.meta.url);
  return /* @__PURE__ */ React.createElement(
    ScopedStylesheet,
    {
      url: cssUrl,
    },
    /* @__PURE__ */ React.createElement(
      "button",
      {
        className:
          `c-button style-${style} size-${size} icon-location-${iconLocation} ` +
          classKebab({
            hasIcon: Boolean(icon),
            isSelected,
            isFullWidth,
          }),
        type,
        disabled: Boolean(isDisabled),
        href,
        target,
        style: buttonStyles,
        onMouseDown,
        onClick: async (e) => {
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
        },
      },
      icon && iconLocation === "left" && $iconWrapper,
      isLoading ? "Loading..." : text,
      icon && iconLocation === "right" && $iconWrapper,
    ),
  );
}
export { Button as default };
