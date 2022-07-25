import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss `
.c-option {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  padding: var(--tfl-spacing-sm);

  font-family: var(--tfl-font-family-body-sans);
  border: var(--tfl-border-width-sm) solid var(--tfl-color-secondary-bg-border);
  border-radius: var(--tfl-border-radius-md);
  background-color: var(--tfl-color-secondary-bg-fill);
  cursor: pointer;

  .is-selected {
    border: var(--tfl-border-width-sm) solid var(--tfl-color-primary-border);
  }

  &:not(.is-selected):hover {
    border: var(--tfl-border-width-sm) solid var(--tfl-color-primary-border);
  }
  
  > .progress {
   position: absolute;
   top: 0;
   left: 0;
   bottom: 0;
  
   background-color: var(--tfl-color-tertiary-bg-fill);
   border-radius: var(--tfl-border-radius-md);
   transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  .is-disabled {
    pointer-events: none;
  }

  > .title {
    flex: 1;
    z-index: 1;
  }

  > .vote {
    z-index: 1;
    display: flex;
    font-weight: var(--tfl-font-weight-body-semibold);

    > .percentage {
      margin-right: 4px
    }
  }
}

.is-transparent {
  background-color: rgba(255, 255, 255, 0.16) !important;
  
  > .progress {
   background-color: var(--tfl-color-primary-fill) !important;
  }
}
`