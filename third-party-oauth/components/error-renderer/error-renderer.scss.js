import { scss } from '../../deps.ts'

export default scss`
.c-error {
  color: var(--tfl-color-on-bg-fill);
  background: var(--tfl-color-bg-fill);
  font-family: var(--mm-font-family);
  display: flex;
  flex-direction: column;
  width: 100%;

  > .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    font-size: 16px;
    line-height: 19px;
    color: var(--error-red);
  }
}

`