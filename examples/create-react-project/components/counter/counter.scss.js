import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
:host {
  > .count {
    background: rgba(0, 0, 0, 0.1);
    padding: 8px;
  }

  > .button {
    background: rgba(255, 0, 0, 0.5);
    border: none;
    padding: 8px;
    margin-top: 4px;
    cursor: pointer;
  }
}`;
