import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss `
.c-mash-controls {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  padding: var(--tfl-spacing-layout-lg);

  background-color: var(--tfl-color-bg-fill);
  color: var(--tfl-color-on-bg-fill);

  --tfl-color-secondary-bg-border: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill-hovered: rgb(50, 70, 99);
  --tfl-color-tertiary-bg-fill: rgba(45, 57, 74, 1);
  --mario-red: #E52521;
  --retro-green: #5AFFBA;

  > .status {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: fit-content;
    border-radius: var(--tfl-border-radius-lg);
    padding: 12px;
    gap: 12px;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;

    > .stats {
      display: flex;
      gap: 12px;
    }
    
    .info {
      color: var(--retro-green);
      font-family: var(--tfl-font-family-body-mono);
      font-weight: var(--tfl-font-weight-heading-semibold);
      font-size: var(--tfl-font-size-heading-md);
    }

    .clock {
      color: var(--tfl-color-on-bg-fill);
      font-size: var(--tfl-font-size-heading-lg);
    }
  }


  > .button-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    border: none;
    padding: 8px;
    margin-top: 4px;
    gap: var(--tfl-spacing-2xl);

    > .mash-button {
      display: flex;
      justify-content: center;
      height: 300px;
      width: 300px;
      border-radius: 50%;
      padding: var(--tfl-spacing-lg);
      cursor: pointer;
      user-select: none;

      background-position: center;
      background-repeat: no-repeat;
      background-image: url("https://cdn.bio/assets/images/dev_plat_examples/mash/mash-font.svg");

      &:not(:disabled) {
        outline-offset: 1px;
        outline-style: solid;
        outline-width: 5px;
        outline-color: #FF5ABD;

        &:hover {
          transition: outline-offset .25s ease;
          outline-offset: 3px;
          outline-style: solid;
          outline-width: 5px;
          outline-color: #3965FF;
        }
      }

      &:not(:disabled):active {
        transform: translateY(4px);
        transition: outline-offset .25s ease;
        outline-offset: 8px;
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