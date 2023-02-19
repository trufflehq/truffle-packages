import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-patreon-iframe {
  width: 100%;
  height: 99%; // FIXME make sure scrollbar doesn't show at 100%
  border: none;
  
  &.is-hidden {
    width: 0;
    height: 0;
    visibility: hidden;
    pointer-events: none;
    position: absolute;
  }
}`;
