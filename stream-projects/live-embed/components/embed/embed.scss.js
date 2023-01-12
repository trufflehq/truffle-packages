import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-embed {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-family: Roboto;
  position: relative;

  > .iframe {
    width: 100%;
    height: 100%;
    border: none;
    padding: 0;
    margin: 0;
    // TODO: re-add this, but only once we have some sort of hide functionality
    // pointer-events: none;
  }

  > .title {
    position: absolute;
    text-decoration: none;
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    text-align: center;
    background: rgba(0, 0, 0, 0.8);
    font-weight: 600;
    font-size: 14px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    > .live {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ff0000;
      margin-right: 8px;
    }
  }

  > .button {
    position: absolute;
    display: inline-block;
    text-decoration: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    padding: 6px 16px;
    background: rgba(40, 40, 40, 0.8);
    border-radius: 30px;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      background: rgba(40, 40, 40, 0.9);
    }
  }
}`;
