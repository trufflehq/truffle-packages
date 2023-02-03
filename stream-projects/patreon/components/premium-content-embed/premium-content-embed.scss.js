import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-premium-content-embed {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-family: Roboto;
  position: relative;
  display: block;
  text-decoration: none;

  &.is-collapsed {
    > .top {
      padding: 8px;
      height: 30px;

      > .info {
        > .description {
          display: none;
        }
      }
    }
  }

  > .top {
    text-decoration: none;
    width: 100%;
    padding: 12px 16px;
    box-sizing: border-box;
    background: #292829;
    color: #fff;
    display: flex;
    align-items: center;

    > .icon {
      margin-right: 16px;
    }

    > .info {
      > .title {
        font-weight: 600;
        font-size: 16px;
        line-height: 19px;
      }

      > .description {
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
        color: rgba(255, 255, 255, 0.7);
        margin-top: 2px;
      }
    }

    > .close {
      margin-left: auto;
    }
  }

  > .content {
    padding: 16px;
    background: #111;
    color: #fff;
    font-weight: 600;
    font-size: 16px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;

    > .preview {
      height: 208px;
      margin-bottom: 16px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      // give blur hard edges
      // https://stackoverflow.com/a/23370117
      overflow: hidden;
      -webkit-transform: translate3d(0, 0, 0);

      > .background {
        position: absolute;
        width: 100%;
        height: 100%;
        background-size: cover;
        filter: blur(4px);
        z-index: -1;
      }

      > .button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        text-decoration: none;
        text-align: center;
        padding: 6px 16px;
        background: #FF424D;
        border-radius: 30px;
        color: #000;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;

        &:hover {
          background: #db3842;
        }
      }
    }

    > .info {
      > .title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}`;
