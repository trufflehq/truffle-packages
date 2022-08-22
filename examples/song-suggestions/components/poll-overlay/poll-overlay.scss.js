import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`:host {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  --tfl-color-bg-fill: rgba(11, 9, 17, 0.7);
  background: var(--tfl-color-bg-fill);
}

.c-poll-overlay {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  padding: 0 var(--tfl-spacing-layout-lg);
  color: var(--tfl-color-on-bg-fill);
  --tfl-color-secondary-bg-border: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill-hovered: rgb(50, 70, 99);
  --tfl-color-tertiary-bg-fill: rgba(45, 57, 74, 1);
}`