import { scss } from '../../deps.ts'

export default scss`
:host {
  color: var(--tfl-color-on-bg-fill);
  background: var(--tfl-color-bg-fill);
  font-family: var(--tfl-font-family-body-sans);
  --error-red: rgba(238, 113, 113, 1);
  display: block;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.c-login-manager {
  color: var(--tfl-color-on-bg-fill);
  background: var(--tfl-color-bg-fill);
  font-family: var(--tfl-font-family-body-sans);
  display: block;
  width: 100%;
  height: 100%;
  overflow: auto;

  > .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;

    > .snuffle {
      display: flex;
      max-width: 350px;
      height: 350px;
      width: 100%;
    }
    > .title {
      font-family: var(--mm-font-family);
    }

    > .error {
      font-size: 16px;
      line-height: 19px;
      color: var(--error-red);
      font-family: var(--mm-font-family);
    }
  }
}`;
