import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss `
.c-mash-controls {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: var(--tfl-color-bg-fill);
  background-image: url("https://i.pinimg.com/474x/18/1c/d9/181cd9132f3c1c96d5beb322932add06--super-mario-portfolio.jpg");
  color: var(--tfl-color-on-bg-fill);

  padding: 0 var(--tfl-spacing-layout-lg);

  --tfl-color-secondary-bg-border: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill-hovered: rgb(50, 70, 99);
  --tfl-color-tertiary-bg-fill: rgba(45, 57, 74, 1);

  --mario-red: #E52521;

  > .status {
    position: fixed;
    left: 48px;
    top: 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: fit-content;
    background-color: #FBD000;
    border-radius: var(--tfl-border-radius-lg);
    padding: 12px;
    gap: 12px;
    
    .info {
      color: var(--tfl-color-bg-fill);
      font-family: var(--tfl-font-family-body-mono);
      font-weight: var(--tfl-font-weight-heading-semibold);
      font-size: var(--tfl-font-size-heading-md);
      
    }


  }


  > .button-wrapper {
    display: flex;
    justify-content: center;
    border: none;
    padding: 8px;
    margin-top: 4px;
    cursor: pointer;

    > .mash-button {
      display: flex;
      justify-content: center;
      background: var(--mario-red);
      height: 300px;
      width: 300px;
      border-radius: 50%;
      padding: var(--tfl-spacing-lg);
      font-family: var(--tfl-font-family-heading-mono);
      font-size: var(--tfl-font-size-heading-2xl);
      font-weight: var(--tfl-font-weight-heading-bold);
      border: 8px solid var(--tfl-color-bg-fill);

      &:active {
        transform: translateY(4px);
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