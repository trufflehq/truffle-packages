import React from "https://npm.tfl.dev/react";
import root from "https://npm.tfl.dev/react-shadow@19";
import _ from "https://npm.tfl.dev/lodash?no-check";

import classKebab from "https://tfl.dev/@truffle/utils@0.0.2/legacy/class-kebab.ts";

import * as legacyIcons from "../../../legacy/icons.ts";

export default function Icon(props) {
  const {
    icon,
    isAlignedTop,
    isAlignedLeft,
    isAlignedRight,
    isAlignedBottom,
    isCircled,
    color,
    onclick,
    onmousedown,
    ontouchstart,
    isCentered,
    hasRipple,
    viewBox = 24,
    heightRatio = 1,
    units = "px",
  } = props;
  let {
    isTouchTarget,
    size = 24,
    touchWidth = "40px",
    touchHeight = "40px",
  } = props;

  const isClickable = Boolean(onclick || onmousedown || ontouchstart);

  if (isCircled) {
    isTouchTarget = isTouchTarget || true;
  }

  return (
    <root.div
      className={"c-icon " + classKebab({
        isAlignedTop,
        isAlignedLeft,
        isAlignedRight,
        isAlignedBottom,
        isCentered,
        isTouchTarget,
        isClickable,
        isCircled,
        hasRippleWhite: hasRipple && color !== "var(--tfl-color-on-bg-fill)",
        hasRippleHeader: hasRipple && color === "var(--tfl-color-on-bg-fill)",
      })}
      tabIndex={hasRipple ? 0 : undefined}
      onMouseDown={onmousedown}
      onTouchStart={ontouchstart}
      style={{
        minWidth: isTouchTarget ? touchWidth : "0", // 100% makes having a wrapper div necessary
        minHeight: isTouchTarget ? touchHeight : "100%", // nec to center
        width: size,
        height: `${parseInt(size) * heightRatio}${units}`,
      }}
    >
      <link
        rel="stylesheet"
        href={new URL("icon.css", import.meta.url).toString()}
      />
      <svg
        onClick={onclick}
        namespace="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewBox} ${viewBox * heightRatio}`}
        style={{
          width: size,
          height: `${parseInt(size) * heightRatio}${units}`,
        }}
      >
        <path
          namespace="http://www.w3.org/2000/svg"
          d={legacyIcons[`${_.camelCase(icon)}IconPath`] ?? icon}
          fill={color ?? "var(--tfl-color-on-bg-fill)"}
          fillRule="evenodd"
        />
      </svg>
    </root.div>
  );
}
