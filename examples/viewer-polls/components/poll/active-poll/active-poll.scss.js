import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss `
.c-active-poll {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--tfl-color-bg-fill);
  color: var(--tfl-color-on-bg-fill);

  padding: 0 var(--tfl-spacing-layout-lg);

  --tfl-color-secondary-bg-border: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill-hovered: rgb(50, 70, 99);
  --tfl-color-tertiary-bg-fill: rgba(45, 57, 74, 1);

  > .count {
    background: rgba(0, 0, 0, 0.1);
    padding: 8px;
  }


  > .button {
    background: rgba(255, 0, 0, 0.2);
    border: none;
    padding: 8px;
    margin-top: 4px;
    cursor: pointer;
  }
  
  .primary-button {
    display: flex;
    justify-content: center;
    height: 40px;
    font-weight: var(--tfl-font-weight-body-semibold);
    --tfl-color-surface-fill: var(--tfl-color-secondary-fill);
    
    &:hover {
      --tfl-color-surface-fill-hovered: var(--tfl-color-secondary-fill-hovered);
    }
    
    &:active {
      --tfl-color-surface-fill-pressed: var(--tfl-color-secondary-fill-pressed);
    }
  }
  
  > footer {
    margin-top: var(--tfl-spacing-layout-xs);
  }
}
`