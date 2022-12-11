import { scss } from "../../deps.ts";

export default scss`
$container-width: 95vw;

.c-snack-bar-container {
  width: 90%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  overflow: visible;
  z-index: 1000;
  &.position-top {
    bottom: 16px;
  }
  &.position-bottom {
    bottom: 48px;
  }
}
`;
