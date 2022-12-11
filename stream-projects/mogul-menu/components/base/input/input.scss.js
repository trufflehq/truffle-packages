import { scss } from "../../../deps.ts";

export default scss`
.c-legend-input {
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

  > input {
    all: unset;
    display: flex;
    box-sizing: border-box;
    padding: var(--tfl-spacing-xs) var(--tfl-spacing-sm);
    border: var(--tfl-border-width-sm) solid var(--tfl-color-surface-border);
    border-radius: var(--tfl-border-radius-md);
    width: 100%;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
}

`