import React from "https://npm.tfl.dev/react";
import classKebab from "https://tfl.dev/@truffle/utils@~0.0.2/legacy/class-kebab.ts";
import ScopedStylesheet from "../scoped-stylesheet/scoped-stylesheet.jsx";
import { getSrcByImageObj } from "https://tfl.dev/@truffle/utils@~0.0.2/legacy/image.ts";

const DEFAULT_SIZE = "40px";

export default function Avatar({ user, src, rotation, size = DEFAULT_SIZE }) {
  if (user?.avatarImage) {
    if (!src) {
      const sizePx = parseInt(size);
      src = getSrcByImageObj(user.avatarImage, {
        size: sizePx > 60 ? "large" : "small",
      });
    }
  }

  const defaultColors = [
    "#f94144",
    "#f3722c",
    "#f8961e",
    "#f9844a",
    "#f9c74f",
    "#90be6d",
    "#43aa8b",
    "#4d908e",
    "#577590",
    "#277da1",
  ];

  const lastChar = user?.id?.substr(user?.id?.length - 1, 1) || "a";
  const avatarColor = defaultColors[
    Math.ceil((parseInt(lastChar, 16) / 16) * (defaultColors.length - 1))
  ];

  if (!src) {
    const placeholderFill = avatarColor.replace("#", "%23"); // cssVars.getRawValue(cssVars.$bgBaseText50)
    src =
      `data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M-1-1h582v402H-1z'/%3E%3Cg%3E%3Cpath d='M16 8a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H8v-2c0-2.21 3.58-4 8-4z' fill='${placeholderFill}'/%3E%3C/g%3E%3C/svg%3E`;
  }

  // w/o data is legacy. can probably rm in 2022
  const aspectRatio = user?.avatarImage?.data?.aspectRatio ||
    user?.avatarImage?.aspectRatio;

  return (
    <ScopedStylesheet url={new URL("avatar.css", import.meta.url)}>
      <div
        className="c-avatar"
        style={{
          width: size,
          height: size,
        }}
      >
        {src &&
          (
            <div
              className={"image " + classKebab(rotation)}
              style={{
                backgroundImage: (user || src) ? `url("${src}")` : undefined,
                // backgroundSize: 'cover' is slow
                backgroundSize: aspectRatio < 1 ? "100% auto" : "auto 100%",
              }}
            />
          )}
      </div>
    </ScopedStylesheet>
  );
}
