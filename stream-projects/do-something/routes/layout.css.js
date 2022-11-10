import { scss } from "../deps.ts";

export default scss`
  :host {
    --color-bg-primary: #000000;
    --color-bg-secondary: #191919;
    --color-bg-tertiary: #222222;
    --color-primary: #DBA048;
    --color-divider: #333333;
    --color-demphasized-text: #bdbdbd;
    --color-text-bg-dark: #ffffff;
    --color-text-bg-light: #000000;
    --font-family-normal: "Inter", "Roboto", "Arial";

    background: var(--color-bg-primary);
    color: var(--color-text-bg-dark);
    font-family: var(--font-family-normal);
    display: block;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
`;
