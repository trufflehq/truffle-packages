import { css } from '../deps.ts';

export default css`
:host {
  background: var(--tfl-color-bg-fill);
  color: var(--tfl-color-on-bg-fill);
  font-family: var(--tfl-font-family-body-sans);
  display: block;
  width: 100%;
  height: 100%;
  overflow: auto;
}

:host > .layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

:host > .layout > .container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: center;
}
`;
