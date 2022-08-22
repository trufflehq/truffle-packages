import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`.c-option {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  padding: 6px;
  font-size: 14px;
  font-family: var(--tfl-font-family-body-mono);
  border: var(--tfl-border-width-sm) solid var(--tfl-color-secondary-bg-border);
  border-radius: var(--tfl-border-radius-md);
  background-color: var(--tfl-color-secondary-bg-fill);
  cursor: pointer;
}

.c-option .is-selected {
  border: var(--tfl-border-width-sm) solid var(--tfl-color-primary-border);
}

.c-option:not(.is-selected):hover {
  border: var(--tfl-border-width-sm) solid var(--tfl-color-primary-border);
}

.c-option > .progress {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: var(--tfl-color-tertiary-bg-fill);
  border-radius: var(--tfl-border-radius-md);
  transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.c-option .is-disabled {
  pointer-events: none;
}

.c-option > .title {
  flex: 1;
  z-index: 1;
}

.c-option > .vote {
  z-index: 1;
  display: flex;
  font-weight: var(--tfl-font-weight-body-semibold);
}

.c-option > .vote > .percentage {
  margin-right: 4px;
}

.is-transparent {
  background-color: rgba(255, 255, 255, 0.16) !important;
}

.is-transparent > .progress {
  background-color: var(--tfl-color-primary-fill) !important;
}`