import { scss } from "../../deps.ts";

export default scss`
html, body {
  color-scheme: only light; /* otherwise dark mode inverts images and text too much */
}

:root {
  color-scheme: only light;
}

.c-terroriser-chat-theme {
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
    /*background: rgba(255,255,255, 0.1);*/

    &:after {
      content: '';
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/terroriser/chat_bg_logo.png);
      background-size: 80%;
      background-position: 50%;
      background-repeat: no-repeat;
    }
  }
}

`;
