import { scss } from "../../deps.ts";

export default scss`
.chat-input {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #000000;
  font-family: var(--mm-font-family);
  padding: 8px 16px 12px 16px;
  border-top: 1px solid var(--mm-color-bg-secondary);
  --error-red: #ED6565;

  > .c-legend-input {
    width: 100%;
  }
  
  .status-message {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
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
    margin-top: 8px;

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
        margin: -8px; // offset the extra padding
        border-radius: 50%;
        box-sizing: border-box;
        outline: none;

        > .send-icon {
          // in ios safari click events seem to stop propagating at the web component level vs going up to other
          // web components / root (different behavior from every other browser including mac safari)
          pointer-events: none;
          background: url(https://cdn.bio/assets/images/features/browser_extension/send.svg);
          background-size: 100%;
          width: 24px;
          height: 24px;
        }

        &.is-disabled {
          filter: grayscale(80%);
          pointer-events: disabled;
          cursor: not-allowed;
        }
      }
    }
  }
}`;
