import { scss } from "../../deps.ts";

export default scss`

.c-page-stack {
  /* 100% of the menu minus the tab bar height */
  height: calc(100% - 40px);
  width: 100%;
  min-height: 0;
  position: absolute;
}
`;
