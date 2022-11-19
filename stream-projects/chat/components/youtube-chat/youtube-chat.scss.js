import { scss } from "../../deps.ts";

export default scss`
:host {
  --mm-tooltip-bg: #5c6066;
  --mm-tooltip-text-color: #fff;
}
.c-youtube-chat {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;

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

  .messages {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
    /* background: var(--mm-color-bg-tertiary); */
    background: #181818; /* yt chat bg */
    color: #FFF;

    > .inner {
      display: flex;
      flex-direction: column-reverse;
      height: 100%;
      overflow-y: scroll; /* has to be scroll, not auto */
      -webkit-overflow-scrolling: touch;
      width: 100%;
      overflow-x: hidden;
      box-sizing: border-box;
      z-index: 2;
      box-sizing: border-box;
      position: relative;
      padding-bottom: 8px;

      > .message {
        display: block;
        font-size: 13px;
        line-height: 16px;
        padding: .3rem 1.5rem; /* from twitch */
        word-wrap: break-word;
        word-break: break-word;
        font-family: Inter;
        > .author {
          display: inline-block;
          align-items: baseline;
          margin-right: 4px;
          gap: 2px;

          > .badges {

            .badge {
              width: 16px;
              height: 16px;
              margin-bottom: -2px;
              margin-right: 4px;
              box-sizing: border-box;
            }
          }

          > .name {
            font-weight: 700;
    
            > .separator {
              color: #efeff1;
            }
          }
        }

        > .message-text {
          word-wrap: break-word;
          word-break: break-word;
          overflow-wrap: break-word;
          overflow: hidden;
          min-height: 24px;

          // display: flex;
          // align-items: center;

          .truffle-emote {
            width: auto !important;
            height: 28px;
            margin: -1px 2px 1px;
            vertical-align: middle;
          }
        }
      }
    }
  }
  
  .youtube {
    clip-path: inset(calc(100% - 112px) 0 0 0);
    // position: fixed;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 1;
    // margin-top: -160px;  /* hack for android to slide the keyboard up */


    > iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
}

.landscape {
  .youtube {
    margin-top: -120px; /* hack for android to slide the keyboard up */
  }
}




.truffle-tooltip-wrapper {
  display: inline-block;
  position: relative;

  &:hover .truffle-tooltip {
    display: flex;
    flex-direction: column;
  }
}

.truffle-tooltip {
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

  &.truffle-tooltip--up {
    top: auto;
    bottom: 100%;
    left: 0;
    margin-bottom: 6px;

    &.truffle-tooltip--align-center {
      left: 50%;
      transform: translateX(-50%);

      &:after {
        left: 50%;
        margin-left: -3px;
      }
    }

    &:after {
      border-radius: 1px;
      top: 100%;
      left: 6px;
      margin-top: -3px;
    }
  }

  &:before {
    top: -6px;
    left: -6px;
    width: calc(100% + 12px);
    height: calc(100% + 12px);
    z-index: -1;
  }

  &:after {
    background-color: var(--mm-tooltip-bg);
    width: 6px;
    height: 6px;
    transform: rotate(45deg);
    z-index: -1;
  }

  &:after,
  &:before {
    position: absolute;
    content: '';
  }
}
`;