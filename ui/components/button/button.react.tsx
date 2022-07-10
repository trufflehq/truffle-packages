import React from "https://npm.tfl.dev/react";
import wc from "./button.dist.ts";

export default function Button({ appearance = 'primary', children }) {
  return (
    <wc.tagName appearance={appearance}>{children}</wc.tagName>
  )
}

Button.propTypes = wc.propTypes;
