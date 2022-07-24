import { css } from "../../deps.ts";

export default css`

  .c-response-list > .response-list-item {
    padding: 10px;
  }

  .c-response-list > .response-list-item:not(:last-child) {
    border-bottom: 1px solid white;
  }
  
  .c-response-list > .response-list-item.is-selected {
    background-color: var(--tfl-color-secondary-fill);
    color: var(--tfl-color-on-secondary-fill);
  }

  .c-response-list > .response-list-item:hover {
    background-color: gray;
    cursor: pointer;
  }

  .c-response-list > .response-list-item > .user-name {
    font-size: var(--tfl-font-size-heading-sm);
    font-weight: bold;
  }

`