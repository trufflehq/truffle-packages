import { scss } from "../../../deps.ts";

export default scss`
:root {
  background-color: #000 !important;
}

body {
  background-color: #000 !important;
}

.c-native-menu {
  height: 100%;
  width: 100%;
  position: relative;

  --error-red: rgba(238, 113, 113, 1);
  --success-green: rgba(107, 190, 86, 1);
  // --mm-gradient: var(--mm-gradient);
  $clip-path-transition: .5s;

  &.position-top-left, &.position-bottom-left {
    > .menu {
      > .inner {
        > .bottom {
          > .c-tab-bar {
            flex-direction: row;
            order: 2;
          }
          > .c-extension-icon {
            order: 1;
          }
        }
      }
    }
  }



  &.is-collapsed {
    > .menu {
      > .portrait-collapsed-button {
        transition: clip-path $clip-path-transition cubic-bezier(.4, .71, .18, .99);
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        margin-top: 40px;
        padding: 4px;
        background-color: rgba(255, 255, 255, 1);
        color: rgba(0, 0, 0, 1);
        border: 1px solid rgba(0, 0, 0, 1);
        border-radius: 40px;
        width: 28%;
        margin: 0 auto 12px auto; // 12px is the margin between the bottom of the menu and the bottom of the screen
        box-sizing: border-box;
        height: 40px;
        font-size: 12px;
        font-weight: 600;
        line-height: 24px;

        > .extension-icon {
          // in ios safari click events seem to stop propagating at the web component level vs going up to other
          // web components / root (different behavior from every other browser including mac safari)
          pointer-events: none;
          clip-path: inset(0 0 0 0 round 50%);  
        }

        > .title {
          margin-left: 6px;
        }
      }


      > .landscape-collapsed-button {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 60px;
        padding: 10px 0;
        background-color: rgba(0, 0, 0, 0.8);
        border: 2px solid rgba(255, 255, 255, 0.36);
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;

        > .icon {
          // in ios safari click events seem to stop propagating at the web component level vs going up to other
          // web components / root (different behavior from every other browser including mac safari)
          pointer-events: none;
        }
      }

      &.landscape {
        background: transparent;
      }

      &.portrait {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      
      }
    }
  }

  > .menu {
    transition: clip-path $clip-path-transition cubic-bezier(.4, .71, .18, .99);
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: var(--mm-color-bg-primary);
    color: var(--mm-color-text-bg-primary);
    font-family: var(--mm-font-family);

    > .inner {
      height: 100%;
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;

      &.is-collapsed {
        display: none;
      }

      > .collapse {
        align-self: flex-end;
        border-radius: 50%;
        border: 2px solid var(--mm-color-primary);
        padding: 4px;
        width: 20px;
        height: 20px;
        margin-bottom: 4px;

        > .icon {
          // in ios safari click events seem to stop propagating at the web component level vs going up to other
          // web components / root (different behavior from every other browser including mac safari)
          pointer-events: none;
        }
      }

      > .close {
        position: absolute;
        top: 48px;
        right: 12px;
        cursor: pointer;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }

      > .body {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
        /* max-height: calc((100% - 68vw) - 40px); *//* cap the height of the menu body */

        > .tab-body {
          flex: 1;
          box-sizing: border-box;
          min-height: 0;
  
          &::-webkit-scrollbar {
            width: 0;
            background: transparent;
          }
        }
      }

      > .bottom {
        display: flex;
        justify-content: flex-end;
        max-height: 48px;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid rgba(58, 58, 58, 1);

        > .c-tab-bar {
          flex-direction: row;
          order: 2;
        }

        > .c-extension-icon {
          order: 1;
        }
      }
    }
  }
}
`;
