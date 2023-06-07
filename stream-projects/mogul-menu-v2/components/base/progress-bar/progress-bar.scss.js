import { scss } from "../../../deps.ts";

export default scss`
.c-progress {
  position: relative;
  overflow: hidden;
  border-radius: 99999px;
  width: 100%;
  height: 4px;
}

.c-progress-indicator {
  width: 100%;
  height: 100%;
  transition: transform 660ms cubic-bezier(0.65, 0, 0.35, 1) 250ms;
}`;
