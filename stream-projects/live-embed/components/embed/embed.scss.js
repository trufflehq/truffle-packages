import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-embed {
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-family: Roboto;

  > .iframe {
    width: 100%;
    height: 100%;
  }

  > .title {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    text-align: center;
    background: rgba(0, 0, 0, 0.8);
    font-weight: 600;
    font-size: 14px;
    color: #fff;
  }

  > .action {
    position: absolute;
  }
}`;
