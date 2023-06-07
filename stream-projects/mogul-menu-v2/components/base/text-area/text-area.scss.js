import { scss } from "../../../deps.ts";

export default scss`
.c-legend-text-area {
  display: inline-block;
  flex: 1;

  &.has-error {
    > input {
      border-color: var(--error-red) !important;
    }
  }
  
  .label {
    display: flex;
    flex: 1;
    font-size: 15px;
    font-weight: 500;
    color: 'white';
    user-select: 'none';
    margin-bottom: 8px;
  }

  > textarea {
    all: unset;
    display: flex;
    box-sizing: border-box;
    padding: var(--tfl-spacing-xs) var(--tfl-spacing-sm);
    border: var(--tfl-border-width-sm) solid var(--tfl-color-surface-border);
    border-radius: var(--tfl-border-radius-md);
    background-color: var(--mm-color-bg-secondary);
    width: 100%;
  }
}

`;
