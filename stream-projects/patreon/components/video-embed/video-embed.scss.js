import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-video-embed {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.c-premium-preview {
  width: 100%;
  height: 100%;
  flex: 1;
  background: #000;
}

.c-patreon-video {
  font-family: 'Roboto', sans-serif;
  width: 100%;
  height: 100%;
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
  
  &.is-visible {
    background: #000;

    > .iframe-wrapper {
      opacity: 1;
      flex: 1;
    }
  }

  > .iframe-wrapper {
    width: 100%;
    height: 100%;
    opacity: 0;
    background: #000;
  }

  > .loading {
    display: none;
  }
}

.c-video-info-bar {
  font-family: Roboto, sans-serif;
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

  > .info {
    margin-right: 24px;

    > .subtitle {
      font-weight: 500;
      font-size: 10px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 2px;
    }

    > .title {
      font-size: 14px;
      font-weight: 400;
    }
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

.c-patreon-upsell {
  background: #292829;
  color: #fff;
  padding: 32px;
  font-family: 'Roboto', sans-serif;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;

  > .close {
    position: absolute;
    top: 16px;
    right: 16px;
  }

  > .header {
    display: flex;
    align-items: center;

    > .icon {
      width: 80px;
      height: 80px;
      background: #000;
      border-radius: 50%;
      border: 1px solid #fff;
      margin-right: 20px;
      display: flex;
      align-items: center;
      justify-content: center;

      > svg {
        width: 50%;
        height: 50%;
      }
    }

    > .info {
      > .subtitle {
        font-weight: 500;
        font-size: 14px;
        text-transform: uppercase;
        color: #FF424D;
      }

      > .title {
        font-weight: 600;
        font-size: 22px;
        color: #fff;
        margin-top: 2px;
      }
    }
  }

  > .tiers {
    display: flex;
    gap: 20px;
    margin-top: 36px;

    > .tier {
      flex: 1;
      background: #3A393A;
      border: 1px solid #FFFFFF;
      border-radius: 6px;

      > .title {
        padding: 16px;
        background: #fff;
        color: #000;
        font-weight: 700;
        font-size: 18px;
        text-align: center;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
      
      > .info {
        padding: 24px 16px 16px 16px;

        > .price {
          font-weight: 600;
          font-size: 26px;
          text-align: center;
        }

        > .button {
          margin-top: 24px;
          // TODO: button component
          display: block;
          text-decoration: none;
          text-align: center;
          padding: 12px;
          background: #FF424D;
          color: #fff;
          border-radius: 26px;
          font-weight: 600;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;

          &:hover {
            background: #db3842;
          }
        }

        > .bullets {
          margin-top: 32px;

          > .label {
            text-transform: uppercase;
            margin-bottom: 16px;
            font-weight: 600;
            font-size: 14px;
          }

          > .bullet {
            display: flex;
            gap: 6px;
            font-weight: 500;
            font-size: 14px;
            margin-bottom: 8px;
          }
        }
      }
    }
  }
}
`;
