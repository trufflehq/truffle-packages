import { scss } from "../../deps.ts";

export default scss`
.chat-input {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #181818;
  font-family: var(--mm-font-family);
  padding: 8px;
  border-top: 1px solid var(--mm-color-bg-secondary);
  --error-red: #ED6565;

  > .c-legend-input {
    width: 100%;
  }
  
  .status-message {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 8px;
    color: var(--mm-color-text-demphasized);
    font-size: 12px;
    font-weight: 400;
  }

  .input {
    font-size: 14px;
    border-radius: 18px;
    background: var(--mm-color-bg-secondary);
  }

  > .actions { 
    display: flex;
    justify-content: space-between;
    padding: 8px 16px;

    > .controls {
      display: flex;
      align-items: center;
      flex: 1;
    }

    > .send {
      display: flex;
      align-items: center;
      flex: 1;
      justify-content: flex-end;
      gap: 12px;


      > .char-count {
        font-size: 13px;
        font-weight: 400;
        font-family: var(--mm-font-family);
        color: rgba(188, 188, 188, 1);


        &.is-message-length-exceeded {
          color: var(--error-red);
        }
      }

      > .icon {
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        box-sizing: border-box;
        border: 2px solid transparent;
        outline: none;

        &.is-disabled {
          filter: grayscale(80%);
          pointer-events: disabled;
          border: 2px solid transparent;
          cursor: not-allowed;

          &:hover {
            border: 2px solid transparent;
          }
        }

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


`