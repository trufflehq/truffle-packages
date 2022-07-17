import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-create-poll {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--tfl-color-bg-fill);
  color: var(--tfl-color-on-bg-fill);
  font-family: var(--tfl-font-family-heading-sans);
  line-height: var(--tfl-line-height-heading-md);

  --tfl-color-secondary-bg-border: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill-hovered: rgb(50, 70, 99);
  --tfl-color-tertiary-bg-fill: rgba(45, 57, 74, 1);
  
  h2 {
    display: flex;
    justify-content: center;
  }
  
  .auth {
    display: flex;
    justify-content: center;
  }
  
  .body {
    padding: var(--tfl-spacing-layout-xs) var(--tfl-spacing-layout-lg);
  }

  .input-field label {
    font-size: var(--tfl-font-size-body-md);
  }
  
  .header {
    font-size: var(--tfl-font-size-body-xl);
    line-height: var(--tfl-line-height-heading-sm);
  }
  
  .options {
    display: grid;
    grid-gap: 6px;
  }

  .add {
    margin-top: 6px;
  }
  
  .bg-button {
    display: flex;
    justify-content: center;
    height: 40px;
    font-weight: var(--tfl-font-weight-body-semibold);
    --tfl-color-surface-fill: var(--tfl-color-secondary-bg-fill);
    
    &:hover {
      --tfl-color-surface-fill-hovered: var(--tfl-color-secondary-bg-fill-hovered);
    }


    &:active {
      --tfl-color-surface-fill-pressed: var(--tfl-color-secondary-bg-fill-hovered);
    }
  }
  
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
  
  footer {
    display: flex;
    justify-content: flex-end;
    border-top: var(--tfl-border-width-sm) solid var(--tfl-color-surface-border);
    
    > .inner {
      display: flex;
      gap: var(--tfl-spacing-sm);
      padding: var(--tfl-spacing-layout-xs) var(--tfl-spacing-layout-sm);
    }
  }
}
`