import { scss } from '../../../deps.ts'

export default scss`
.cube {
  position: absolute;
  transform-style: preserve-3d;
}

.side {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  border-radius: 0;
  box-sizing: border-box;
}

.front {
  transform: rotateX(90deg);
  transform-origin: bottom;
}

.left {
  transform-origin: right;
}
`