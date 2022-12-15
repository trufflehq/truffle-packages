import { scss } from '../../deps.ts'

export default scss`
.c-drlupo-stjude-chat-theme {
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

    &:after {
      content: '';
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/drlupo-stjude/chat_blocks.svg);
      background-size: 80%;
      background-position: 50%;
      background-repeat: no-repeat;
    }
  }
}

`