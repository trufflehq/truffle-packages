import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-subscribe-iframe {
  width: 0;
  height: 0;
  visibility: hidden;
  pointer-events: none;
  position: absolute;
  border: none;

  &.is-visible {
    width: 100%;
    height: 100%;
    visibility: visible;
    pointer-events: all;
    position: static;
  }
}`;
