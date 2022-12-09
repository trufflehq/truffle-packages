import { scss } from '../../deps.ts'

export default scss`
.c-sparkles {
  position: relative !important;
  display: inline-block;
  height: 100%;

  > .child-wrapper {
    position: relative;
    z-index: 1;
    font-weight: bold;
  }
}

.c-sparkle-instance {
  position: absolute;
  display: block;
  opacity: 0;
  animation: sparkle 2s linear;

  > svg {
    display: block;
  }
}

@keyframes sparkle {
  0%  { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}
`