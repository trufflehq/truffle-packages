import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

// sass example (make sure file is named ___.scss.js or ___.sass.js)
export default scss`
.c-chant {
  color: black;
  display: flex;
  width: "104px";
  height: "36px";

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
}

@keyframes pop {
  50%  {transform: scale(2);}
}

@keyframes rainbow { to { background-position: 0 - 200% } }
`;
