import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`.c-submission {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--tfl-color-bg-fill);
  color: var(--tfl-color-on-bg-fill);
  font-family: var(--tfl-font-family-heading-sans);
  --tfl-color-secondary-bg-border: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill-hovered: rgb(50, 70, 99);
  --tfl-color-tertiary-bg-fill: rgba(45, 57, 74, 1);
}
.c-submission > .subtitle {
  display: flex;
  justify-content: center;
  color: var(--tfl-color-surface-fill);
}
.c-submission > .body > .embed {
  height: 50vh;
  margin-bottom: var(--tfl-spacing-layout-xs);
}
.c-submission .iframe-container {
  height: 50vh;
}
.c-submission .iframe-container iframe {
  width: 100%;
  height: 100%;
}

.c-submission h2 {
  display: flex;
  justify-content: center;
}

.c-submission .auth {
  display: flex;
  justify-content: center;
}

.c-submission .body {
  padding: var(--tfl-spacing-layout-xs) var(--tfl-spacing-layout-lg);
}

.c-submission .input-field label {
  font-size: var(--tfl-font-size-body-md);
}

.c-submission .header {
  font-size: var(--tfl-font-size-body-xl);
}

.c-submission .options {
  display: grid;
  grid-gap: 6px;
}

.c-submission .add {
  margin-top: 6px;
}

.c-submission .bg-button {
  display: flex;
  justify-content: center;
  height: 40px;
  font-weight: var(--tfl-font-weight-body-semibold);
  --tfl-color-surface-fill: var(--tfl-color-secondary-bg-fill);
}

.c-submission .bg-button:hover {
  --tfl-color-surface-fill-hovered: var(--tfl-color-secondary-bg-fill-hovered);
}

.c-submission .bg-button:active {
  --tfl-color-surface-fill-pressed: var(--tfl-color-secondary-bg-fill-hovered);
}

.c-submission .primary-button {
  display: flex;
  justify-content: center;
  height: 40px;
  font-weight: var(--tfl-font-weight-body-semibold);
  --tfl-color-surface-fill: var(--tfl-color-primary-fill);
}

.c-submission .primary-button:hover {
  --tfl-color-surface-fill-hovered: var(--tfl-color-primary-fill-hovered);
}

.c-submission .primary-button:active {
  --tfl-color-surface-fill-pressed: var(--tfl-color-primary-fill-hovered);
}

.c-submission .primary-button:disabled, .c-submission .primary-button:disabled:hover, .c-submission .primary-button:disabled:active {
  color: var(--tfl-color-surface-fill-disabled);
  background-color: var(--tfl-color-surface-fill-disabled);
  cursor: var(--tfl-cursor-disabled);
}

.c-submission .secondary-button {
  color: var(--tfl-color-on-surface-fill);
  background-color: var(--tfl-color-surface-fill);
  height: 40px;
}

.c-submission footer {
  display: flex;
  justify-content: flex-end;
  border-top: var(--tfl-border-width-sm) solid var(--tfl-color-surface-border);
}

.c-submission footer > .inner {
  display: flex;
  gap: var(--tfl-spacing-sm);
  padding: var(--tfl-spacing-layout-xs) var(--tfl-spacing-layout-sm);
}`