import { scss } from "../../deps.ts";

export default scss`
.c-youtube-chat {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #181818;

  > .status {
    display: flex;
    justify-content: center;
    text-decoration: underline;
    cursor: pointer;
    font-family: var(--mm-font-family);
    background: var(--mm-color-secondary);
    font-size: 16px;
    line-height: 21px;
    padding: 8px;
  }
  
  .youtube {
    clip-path: inset(calc(100% - 112px) 0 0 0);
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 1;

    > iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
}

.chat-input {
  display: flex;
  flex-direction: column;
  background: #181818;
  font-family: var(--mm-font-family);
  padding: 8px;
  border-top: 1px solid var(--mm-color-bg-secondary);

  > .c-legend-input {
    width: 100%;
  }

  .input {
    font-size: 14px;
    border-radius: 18px;
    background: var(--mm-color-bg-secondary);
  }

  > .actions { 
    display: flex;
    justify-content: flex-end;
    padding: 8px 16px;

    > .send {
      display: flex;
      align-items: center;
      gap: 12px;

      > .char-count {
        font-size: 13px;
        font-weight: 400;
        font-family: var(--mm-font-family);
        color: rgba(188, 188, 188, 1);
      }

      > .icon {
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        box-sizing: border-box;
        border: 2px solid transparent;
        outline: none;

        &:hover {
          // border: 2px solid var(--mm-color-text-bg-primary);
          border: 2px solid rgba(188, 188, 188, 1);
        }

        &:focus {
          border: 2px solid rgba(188, 188, 188, 1);
        }

        &:active {
          border: 2px solid var(--mm-color-primary);
        }
      }
    }
  }
}

.landscape {
  .youtube {
    margin-top: -120px;
  }
}
`;