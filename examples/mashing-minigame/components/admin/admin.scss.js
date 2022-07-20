import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss `
:host {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;

  .primary-button {
    display: flex;
    justify-content: center;
    height: 40px;
    font-weight: var(--tfl-font-weight-body-semibold);
    --tfl-color-surface-fill: var(--tfl-color-primary-fill);
    
    &:hover {
      --tfl-color-surface-fill-hovered: var(--tfl-color-primary-fill-hovered);
    }
    
    &:active {
      --tfl-color-surface-fill-pressed: var(--tfl-color-primary-fill-hovered);
    }
    
    &:disabled,
    &:disabled:hover,
    &:disabled:active {
      color: var(--tfl-color-surface-fill-disabled);
      background-color: var(--tfl-color-surface-fill-disabled);
      cursor: var(--tfl-cursor-disabled);
    }
  }

  .secondary-button {
    color: var(--tfl-color-on-surface-fill);
    background-color: var(--tfl-color-surface-fill);
    height: 40px;
  }
}
`