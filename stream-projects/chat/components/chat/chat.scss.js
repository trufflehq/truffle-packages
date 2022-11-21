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
}
`