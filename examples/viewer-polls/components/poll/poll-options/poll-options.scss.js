import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-poll-options {
  display: grid;
  grid-gap: var(--tfl-spacing-layout-2xs);
  
  > .is-selected {
    border: var(--tfl-border-width-sm) solid var(--tfl-color-primary-border);
  }
  
  > .is-disabled {
    pointer-events: none;
  }
  
  > .error {
    display: flex;
    justify-content: center;
    font-family: var(--tfl-font-family-body-sans);
    line-height: var(--tfl-line-height-body-md);
    font-size: var(--tfl-font-size-body-md);
  
    font-weight: var(--tfl-font-weight-body-medium);
    color: var(--tfl-color-critical-text);
  }
}



`