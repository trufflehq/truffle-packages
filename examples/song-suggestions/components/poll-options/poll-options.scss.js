import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`.c-poll-options {
  display: grid;
  gap: 8px;
}

.c-poll-options > .is-selected {
  border: var(--tfl-border-width-sm) solid var(--tfl-color-primary-border);
}

.c-poll-options > .is-disabled {
  pointer-events: none;
}

.c-poll-options > .error {
  display: flex;
  justify-content: center;
  font-family: var(--tfl-font-family-body-mono);
  font-size: var(--tfl-font-size-body-md);
  font-weight: var(--tfl-font-weight-body-medium);
  color: var(--tfl-color-critical-text);
}`