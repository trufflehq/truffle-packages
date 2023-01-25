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
  padding: 20px 40px;
  box-sizing: border-box;
  background: #774AF0;
  color: #fff;
  border-radius: 10px;
  overflow: hidden;

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
    text-decoration: none;

    &:hover {
      background: #fafafa;
    }

    > .icon {
      margin-right: 10px;
    }
  }
}

.iframe {
  visibility: hidden;
}`;
