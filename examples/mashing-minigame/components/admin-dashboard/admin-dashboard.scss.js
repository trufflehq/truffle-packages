import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
  .c-admin-dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    background: var(--tfl-color-bg-fill);
    color: var(--tfl-color-on-bg-fill);
    font-family: var(--tfl-font-family-heading-sans);
    // line-height: var(--tfl-line-height-heading-md);
  
    --tfl-color-secondary-bg-border: rgba(22, 31, 44, 1);
    --tfl-color-secondary-bg-fill: rgba(22, 31, 44, 1);
    --tfl-color-secondary-bg-fill-hovered: rgb(50, 70, 99);
    --tfl-color-tertiary-bg-fill: rgba(45, 57, 74, 1);

    > .title {
      font-size: var(--tfl-font-size-heading-lg);
      padding: var(--tfl-spacing-xl);
      margin-bottom: var(--tfl-spacing-layout-sm);
    }

    > main {
      display: flex;
      flex-direction: column;
      flex: 1;

      > .status {
        margin-bottom: var(--tfl-spacing-layout-sm);
      }

      > .controls {
        display: flex;
        justify-content: center;
        gap: var(--tfl-spacing-layout-2xs);
      }
    }
  }
`