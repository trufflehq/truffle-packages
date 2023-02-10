import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-youtube {
  font-family: Roboto;
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
  text-align: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #774AF0;
  color: #fff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #774AF0;
  display: flex;
  flex-direction: column;

  > .prompt {
    padding: 20px 32px;

    > .title {
      margin-bottom: 12px;
    }

    > .button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      color: #774AF0;
      border-radius: 30px;
      padding: 6px 10px;
      cursor: pointer;

      &:hover {
        background: #fafafa;
      }

      > .icon {
        margin-right: 10px;
      }
    }
  }

.iframe {
  flex: 1;
  }
}`;
