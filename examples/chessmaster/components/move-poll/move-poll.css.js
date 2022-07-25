import { css } from '../../deps.ts'

export default css`
  .c-move-poll {
    border: 1px solid white;
    border-radius: 4px;
    padding: 20px;
    min-width: 400px;
  }

  .c-move-poll > .status-message {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .c-move-poll > .options > .option {
    position: relative;
    display: flex;
    justify-content: space-between;
    border: 2px solid var(--border-color);
    padding: 5px;
  }

  .c-move-poll > .options > .option:not(.is-clickable) {
    cursor: not-allowed;
  }

  .c-move-poll > .options > .option.is-clickable {
    cursor: pointer;
  }

  .c-move-poll > .options > .option:not(:last-child) {
    margin-bottom: 10px;
  }

  .c-move-poll > .options > .option > .progress-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: gray;
  }

  .c-move-poll > .options > .option > :not(.progress-fill) {
    z-index: 1;
  }
  
`