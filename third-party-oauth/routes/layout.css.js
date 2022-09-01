import css from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default css`
:host {
  color: var(--tfl-color-on-bg-fill);
  background: var(--tfl-color-bg-fill);
  font-family: var(--tfl-font-family-body-sans);
  display: block;
  width: 100%;
  height: 100%;
  overflow: auto;
}`;
