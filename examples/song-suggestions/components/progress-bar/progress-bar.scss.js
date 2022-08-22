import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`.c-progress {
  position: relative;
  overflow: hidden;
  border-radius: 99999px;
  width: 100%;
  height: 4px;
}

.c-progress-indicator {
  background-color: var(--tfl-color-primary-fill);
  width: 100%;
  height: 100%;
  transition: transform 660ms cubic-bezier(0.65, 0, 0.35, 1) 250ms;
}`