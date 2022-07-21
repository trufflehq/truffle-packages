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
    --mario-red: #E52521;
    --retro-green: #5AFFBA;
    padding: var(--tfl-spacing-2xl);

    > .title {
      height: 100px;
      width: 300px;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url("https://cdn.bio/assets/images/dev_plat_examples/mash/mash-font.svg");
      font-size: var(--tfl-font-size-heading-lg);
      padding: var(--tfl-spacing-xl);
    }

    > main {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: var(--tfl-spacing-xl);
      width: 80%;
      max-width: 900px;

      > .auth {
        display: flex;
        justify-content: center;
      }

      > .status {
        margin-bottom: var(--tfl-spacing-layout-sm);
      }

      .button {
        display: flex;
        justify-content: center;
        height: 32px;
        width: 80px;
        background: var(----tfl-color-tertiary-bg-fill);
        border-radius: 8px;
        padding: var(--tfl-spacing-sm);
        cursor: pointer;

        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        
        &:not(:disabled) {
          outline-offset: 1px;
          outline-style: solid;
          outline-width: 3px;
          outline-color: #FF5ABD;
  
          &:hover {
            transition: outline-offset .25s ease;
            outline-offset: 3px;
            outline-style: solid;
            outline-width: 3px;
            outline-color: #3965FF;
          }
        }

        &:not(:disabled):active {
          transition: outline-offset .25s ease;
          outline-offset: 5px;
          outline-style: solid;
          outline-width: 3px;
          outline-color: var(--retro-green);
        }
  
        &:disabled,
        &:disabled:hover,
        &:disabled:active {
          pointer-events: none;
          outline: var(--tfl-color-surface-fill-disabled) solid 1px;
        }
      }

      .start {
        background-image: url("https://cdn.bio/assets/images/dev_plat_examples/mash/start.svg");
      }

      .end {
        background-image: url("https://cdn.bio/assets/images/dev_plat_examples/mash/end.svg");
      }

      > .controls {
        display: flex;
        justify-content: center;
        gap: var(--tfl-spacing-layout-xs);
        margin-bottom: var(--tfl-spacing-layout-sm);
        
      }
    }
  }
`