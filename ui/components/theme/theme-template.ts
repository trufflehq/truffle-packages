import { html } from "https://npm.tfl.dev/@microsoft/fast-element@beta";

export default html`
  <link rel="stylesheet" href=${new URL("./variables.css", import.meta.url)} />
  <style>
    :root {
      background: var(--tfl-color-bg-fill);
      color: var(--tfl-color-on-bg-fill);
      font-family: var(--tfl-font-family-body-sans);
    }
    /* avoid fouc */
    :not(:defined) {
      visibility: hidden;
    }    
  </style>

  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
    rel="stylesheet"
  />`;
