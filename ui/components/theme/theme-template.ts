// only want to reset styles so first (theme/page) component can style however they want
export default `
  <link rel="stylesheet" href=${new URL("./variables.css", import.meta.url)} />
  <style>
    html, body, #root {
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      color-scheme: light only; /* otherwise dark mode inverts images and text too much */
    }
    /* avoid fouc */
    :not(:defined) {
      visibility: hidden;
    }    
  </style>`;
