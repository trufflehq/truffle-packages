import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:host {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  background: var(--tfl-color-bg-fill);

  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  font-family: Inter;
}
:host > .p-submission-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}

.c-admin {
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  // background: var(--tfl-color-bg-fill);
  background: var(--tfl-color-bg-fill);

  color: var(--tfl-color-on-bg-fill);
  // font-family: var(--tfl-font-family-heading-sans);
  font-family: Inter;

  --tfl-color-alt-bg-fill: #181818;
  --tfl-color-secondary-bg-border: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill-hovered: rgb(50, 70, 99);
  --tfl-color-tertiary-bg-fill: rgba(45, 57, 74, 1);


  > header {
    display: flex;
    justify-content: center;
    position: relative;
    padding: 32px;

    > .title {
      display: flex;
      justify-content: center;
      flex: 1;
      font-size: 36px;
    }

  }

  .auth {
    display: flex;
    justify-content: center;
  }

  .perms {
    display: flex;
    justify-content: center;
    margin-top: var(--tfl-spacing-layout-sm);
  }
  > main {
    display: flex;
    flex-direction: column;
    overflow: auto;
    flex: 1;
    height: 100%;
  }
}

.c-admin main > .tabs {
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  align-items: center;
  padding-bottom: 72px;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--tfl-color-bg-fill);
  border-radius: 8px;
  padding: var(--tfl-spacing-xs);
  font-family: var(--tfl-font-family-heading-sans);
  font-size: 24px;
  cursor: pointer;
  height: 64px;
  max-height: 64px;

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

.c-controls {
  position: absolute;
  left: 8px;
  right: 0;
  top: -60px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.clear-button {
  display: flex;
  justify-content: center;
  background: var(--tfl-color-bg-fill);
  border-radius: 4px;
  font-family: var(--tfl-font-family-heading-sans);
  font-size: 14px;
  cursor: pointer;

  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  
  &:not(:disabled) {
    outline-offset: 1px;
    outline-style: solid;
    outline-width: 3px;
    outline-color: #ff7961;

    &:hover {
      transition: outline-offset .25s ease;
      outline-offset: 3px;
      outline-style: solid;
      outline-width: 3px;
    }
  }

  &:not(:disabled):active {
    transition: outline-offset .25s ease;
    outline-offset: 5px;
    outline-style: solid;
    outline-width: 3px;
    outline-color: #3965FF;
  }

  &:disabled,
  &:disabled:hover,
  &:disabled:active {
    pointer-events: none;
    outline: var(--tfl-color-surface-fill-disabled) solid 1px;
  }
}
`;
