import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`.c-tab-trigger {
  --tfl-color-secondary-bg-fill: rgba(22, 31, 44, 1);
  --tfl-color-tertiary-bg-fill: rgba(45, 57, 74, 1);
  all: unset;
  font-family: inherit;
  font-size: 20px;
  background-color: var(--tfl-color-tertiary-bg-fill);
  padding: 16px 20px;
  height: 45;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15;
  line-height: 1;
  color: var(--tfl-color-on-bg-fill);
  user-select: none;
  cursor: pointer;
}
.c-tab-trigger:first-child {
  border-top-left-radius: 6px;
}
.c-tab-trigger:last-child {
  border-top-right-radius: 6px;
}
.c-tab-trigger:hover {
  background: var(--tfl-color-secondary-bg-fill-hovered);
}
.c-tab-trigger[data-state=active], .c-tab-trigger:focus {
  position: relative;
  background: var(--tfl-color-secondary-bg-fill-hovered);
  box-shadow: 0 0 0 2px var(--tfl-color-primary-fill);
}`