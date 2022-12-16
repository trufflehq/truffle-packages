import { scss } from '../../deps.ts'

export default scss`
html, body {
  color-scheme: only light; /* otherwise dark mode inverts images and text too much */
}

:root {
  color-scheme: only light;
}

.c-watch-party-chat-theme {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;

  .background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
  }
}
`