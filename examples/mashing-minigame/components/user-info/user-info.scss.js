import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";


export default scss `:host > .count {
  background: rgba(0, 0, 0, 0.1);
  padding: 8px;
}

:host > .button {
  background: rgba(255, 0, 0, 0.2);
  border: none;
  padding: 8px;
  margin-top: 4px;
  cursor: pointer;
}
:host {
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
  
  .login {
    background-image: url("https://cdn.bio/assets/images/dev_plat_examples/mash/login.svg");
  }
}
`