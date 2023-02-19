import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-video-embed {
  &.has-url {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    pointer-events: none;
    
    > .iframe-wrapper {
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }

  &.is-visible {
    pointer-events: all;

    > .iframe-wrapper {
      opacity: 1;
    }
  }
}`;
