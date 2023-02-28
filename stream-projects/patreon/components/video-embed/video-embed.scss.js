import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-video-embed {
  font-family: 'Roboto', sans-serif;

  &.has-video {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;

    &:not(.is-visible) {
      > .loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        pointer-events: none;
      }
    }
    
    > .iframe-wrapper {
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }

  &.is-visible {
    pointer-events: all;
    background: #000;

    > .iframe-wrapper {
      opacity: 1;
      flex: 1;
    }
  }

  > .loading {
    display: none;
  }

  > .info-bar {
    width: 100%;
    background: #000;
    color: #ffffff;
    padding: 8px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    > .icon {
      margin-right: 10px;
    }

    > .title {
      font-size: 14px;
      font-weight: 400;
      margin-right: 12px;
    }
    
    > .button {
      all: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      text-decoration: none;
      text-align: center;
      padding: 6px 16px;
      background: #000000;
      border: 1px solid #FF424D;
      color: #FF424D;
      border-radius: 30px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;

      &:hover {
        background: #222222;
      }
    }

    > .close {
      margin-left: auto;
    }
  }
}`;
