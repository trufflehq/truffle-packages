import { css } from "../../../deps.ts";

export default css`

  :host {
    flex: 1;
    padding: 20px;
  }

  .l-responses-page {
    height: 100%;
    max-height: 75vh;
    max-width: 1000px;
    margin: auto;
  }
  
  .l-responses-page > .grid {
    display: grid;
    height: 100%;
    grid-template-columns: minmax(200px, 1fr) 3fr;
    border: 1px solid white;
    border-radius: 4px;
    margin-top: 10px;
  }
  
  .l-responses-page > .grid > .response-list-container {
    display: flex;
    flex-direction: column;
    border-right: 1px solid white;
    overflow: auto;
  }
  
  .l-responses-page > .grid > .response-list-container > .title {
    border-bottom: 2px solid white;
    padding: 10px;
    color: var(--tfl-color-primary-fill);
    font-size: var(--tfl-font-size-heading-md);
    font-weight: bold;
  }
  
  .l-responses-page > .grid > .response-list-container > .list {
    flex: 1;
    overflow-y: auto;
  }

  .l-responses-page > .grid > .response-container > .no-response-selected {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .l-responses-page > .grid > .response-container {
    padding: 20px;
  }
`