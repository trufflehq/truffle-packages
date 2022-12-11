import { scss } from "../../deps.ts";

export default scss`
.c-tab-component {
  display: none;
  height: 100%;
  overflow-y: auto;

  &.is-active {
    display: block;
  }
}
`;
