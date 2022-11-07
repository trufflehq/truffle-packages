import React from "https://npm.tfl.dev/react";
import { default as RFMarquee } from "https://npm.tfl.dev/react-fast-marquee";

import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import styleSheet from "./marquee.scss.js";

type MarqueeProps = typeof RFMarquee;

export default function Marquee({ children, ...props }: MarqueeProps) {
  useStyleSheet(styleSheet);
  return (
    <RFMarquee className="c-marquee" {...props}>
      {children}
    </RFMarquee>
  );
}
