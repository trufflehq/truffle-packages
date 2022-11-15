import { scss } from '../../../deps.ts'

export default scss`
:host {
  color: var(--tfl-color-on-bg-fill);
  background: var(--tfl-color-bg-fill);
  font-family: var(--mm-font-family);
  display: block;
  width: 100%;
  height: 100%;
  overflow: auto;
}
`