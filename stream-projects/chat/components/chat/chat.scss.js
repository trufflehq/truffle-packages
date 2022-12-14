import { scss } from "../../deps.ts";

export default scss`
:host {
  --mm-tooltip-bg: #5c6066;
  --mm-tooltip-text-color: #fff;
}

.c-chat {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;

  .scroll {
    position: absolute;
    bottom: 8px;
    left: calc(50% - 20px);
    font-size: 12px;
    padding: 6px;
    background: #2196f3;
    border-radius: 50%;
    z-index: 2000;
    color: #FFF;
    cursor: pointer;
  }

  .messages {
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
    background: #181818; /* yt chat bg */
    color: #FFF;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
    z-index: 2;
    box-sizing: border-box;
    position: relative;
    padding-bottom: 8px;

      .message {
        display: block;
        font-size: 13px;
        line-height: 16px;
        padding: .3rem 1.5rem; /* from twitch */
        word-wrap: break-word;
        word-break: break-word;
        font-family: Inter;
        border-radius: 0.2rem;

        &:hover {
          background: hsla(0,0%,100%,.16);
        }

        > .author {
          display: inline-block;
          align-items: baseline;
          gap: 2px;
          border-radius: 0.2rem;
          
          &:hover {
            background: hsla(0,0%,100%,.16);
          }

          > .badges {

          }

          > .name {
            font-weight: 700;
            border-radius: 0.2rem;
            padding: 0.1rem;

            &.is-verified {
              background: #606060;
              color: #FFF !important;
            }
    
          }
          
        }

        > .separator {
          margin-right: 4px;
          color: #efeff1;
        }
      }
  }
}

/* 
  Since we're rendering the emote + tooltip to a string, we want the styles to live in the parent so 
  their guranteed to be set on first paint
*/
.truffle-tooltip-wrapper {
  display: inline-block;
  position: relative;

  &:hover {
    > .truffle-tooltip {
      display: flex;
      flex-direction: column;
    }
  }

  > .truffle-tooltip {
    padding: 3px 6px;
    border-radius: 0.4rem;
    background-color: var(--mm-tooltip-bg);
    color: var(--mm-tooltip-text-color);
    display: none;
    position: absolute;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.2;
    text-align: center;
    z-index: 2000;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
    gap: 2px;
    margin-bottom: 6px;

    &.is-top {
      top: auto;
      bottom: 100%;
      left: 0;
      margin-bottom: 6px;

      &.is-align-center {
        left: 50%;
        transform: translateX(-50%);
      }

      &.is-align-left {
        left: -3%;
      }
    }

    &.is-bottom {
      top: 100%;
      bottom: auto;
      left: 0;
      margin-bottom: 6px;

      &.is-align-center {
        left: 50%;
        transform: translateX(-50%);
      }

      &.is-align-left {
        left: -3%;
      }
    }
  }
}
`