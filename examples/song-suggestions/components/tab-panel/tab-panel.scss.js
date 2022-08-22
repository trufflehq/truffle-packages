import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`.c-tab-content {
  --tfl-color-secondary-bg-fill: rgba(22, 31, 44, 1);
  --tfl-color-tertiary-bg-fill: rgba(45, 57, 74, 1);
  display: none;
  flex-grow: 1;
  padding: 20px;
  background-color: var(--tfl-color-secondary-bg-fill);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  outline: none;
}
.c-tab-content[data-state=active] {
  display: flex;
  flex-direction: column;
}`