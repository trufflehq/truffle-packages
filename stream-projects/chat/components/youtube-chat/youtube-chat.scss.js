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
`;